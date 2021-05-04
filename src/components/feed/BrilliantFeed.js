import React, { useEffect, useState } from 'react';
import FeedElement from './FeedElement';
import FeedComponent from './FeedComponent';
import { BrilliantFeedStyled, FeedWrapper } from './Feed.style';
import SimpleBar from 'simplebar-react';
import {
    NextMeeting,
    PriorityEmails,
    OverdueTasks,
    UnfinishedDrafts,
    QuickReplyFeed,
} from './FeedExamples';
import { IMPORTANT, URGENT } from '../../data_objects/Consts';
import { useSelector } from 'react-redux';
import { is_same_day, format_date } from '../../utils';
import {
    get_slots,
    add_feed_component,
    fill_meetings,
    is_short_email,
} from './utils';
import { useEmailsHead, useEvents, useTasks } from '../../hooks/redux';
import TaskInfoWrapper from '../tasks/SingleTaskInfo';
import { now } from 'moment';
import { get_prefered_email_time, find_closest_slot } from './utils';
import SuggestedTasks from './SuggestedTasks';

let NOW = new Date();
NOW.setHours(9);
NOW.setMinutes(0);
NOW.setSeconds(0);
const INTERVAL = 60;
const LAST_HOUR = 20;
var num_tasks = 0;
var tasks_for_approval;
export default function BrilliantFeed() {
    let tasks = useTasks('approve_status', undefined).slice(0, 5);

    useEffect(() => {
        tasks_for_approval = tasks;
        num_tasks = tasks.length;
    }, [num_tasks]);
    const user = useSelector((state) => state.user);
    let events = useEvents();
    const [selected_task_id, set_task_id] = useState(undefined);
    const head_emails = useEmailsHead();
    const slots = get_slots(NOW, INTERVAL, LAST_HOUR);
    events = events.filter((e) => is_same_day(NOW, e.start));
    events = events.sort((a, b) => a.start - b.start);
    let feed_components = allocate_meeting_component_slots(slots, events);
    let email_reply_slot_index = find_closest_slot(
        slots,
        get_prefered_email_time(user.prefered_email_time)
    );
    const components = generate_example_components(
        head_emails,
        set_task_id,
        tasks_for_approval
    );
    for (const component of components) {
        let force_index = component.is_email_reply
            ? email_reply_slot_index
            : undefined;
        add_feed_component(feed_components, component, force_index);
    }
    let feed_elements = [];
    for (let i = 0; i < feed_components.length; i++) {
        const item = feed_components[i];
        if (item === undefined) {
            continue;
        } else {
            const time = format_date(slots[i]).time;
            feed_elements.push(
                <FeedElement
                    component={item.component}
                    time={time}
                    title={item.title}
                />
            );
        }
    }
    return (
        <FeedWrapper>
            <TaskInfoWrapper
                thread_id={undefined}
                task_id={selected_task_id}
                close={() => set_task_id(undefined)}
            />
            <SimpleBar className="simple_bar">
                <BrilliantFeedStyled>
                    <h1 className="feed_title">
                        {'Good Morning, ' + user.contact.get_first_name()}
                    </h1>
                    {feed_elements}
                </BrilliantFeedStyled>
            </SimpleBar>
        </FeedWrapper>
    );
}

function allocate_meeting_component_slots(slots, events) {
    const meetings_slots = fill_meetings(slots, events);
    let feed_array_with_meetings = Array(meetings_slots.length);
    for (let i = 0; i < meetings_slots.length; i++) {
        if (meetings_slots[i] !== undefined) {
            feed_array_with_meetings[i] = {
                component: <NextMeeting event={meetings_slots[i]} />,
                title: 'Your next meeting',
            };
        }
    }
    return feed_array_with_meetings;
}

function generate_example_components(
    head_emails,
    select_task,
    tasks_for_approval
) {
    let short_emails = head_emails.filter((e) => is_short_email(e));
    short_emails = short_emails.sort((a, b) => b.date - a.date);
    short_emails = short_emails.slice(0, 5);
    const email_reply_component = {
        component: (
            <QuickReplyFeed
                emails={short_emails}
                remove_email={() => alert('removed')}
            />
        ),
        title: 'Reply to some short emails',
        is_email_reply: true,
    };
    return [
        email_reply_component,
        {
            component: <PriorityEmails priority={URGENT} />,
            title: 'Reply to urgent emails',
        },
        {
            component: <SuggestedTasks tasks={tasks_for_approval} />,
            title: 'New suggested tasks',
        },
        {
            component: (
                <OverdueTasks
                    on_select={select_task}
                    reference_time={NOW}
                    priority={URGENT}
                />
            ),
            title: 'These urgent tasks are due today',
        },

        {
            component: <UnfinishedDrafts emails={head_emails} />,
            title: 'You have unfinished drafts in you mailbox',
        },

        {
            component: (
                <OverdueTasks
                    on_select={select_task}
                    reference_time={NOW}
                    priority={IMPORTANT}
                />
            ),
            title: 'These important tasks are due today',
        },
    ];
}
