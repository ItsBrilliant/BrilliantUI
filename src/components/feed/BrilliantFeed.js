import React, { useEffect, useState } from 'react';
import FeedElement from './FeedElement';
import FeedComponent from './FeedComponent';
import { BrilliantFeedStyled, FeedWrapper } from './Feed.style';
import SimpleBar from 'simplebar-react';
import { NextMeeting, UnfinishedDrafts, QuickReplyFeed } from './FeedExamples';
import PriorityEmails from './PriorityEmails';
import { IMPORTANT, URGENT } from '../../data_objects/Consts';
import { useSelector } from 'react-redux';
import { is_same_day, format_date } from '../../utils';
import { get_slots, add_feed_component, fill_meetings } from './utils';
import { useEmailsHead, useEvents } from '../../hooks/redux';
import TaskInfoWrapper from '../tasks/SingleTaskInfo';
import { get_prefered_email_time, find_closest_slot } from './utils';
import SuggestedTasks from './SuggestedTasks';
import ShortEmails from './ShortEmails';
import FollowupEmails from './FollowupEmails';
import { HangingTasks, OverdueTasks } from './TaskTriage';

let NOW = new Date();
NOW.setHours(9);
NOW.setMinutes(0);
NOW.setSeconds(0);
const INTERVAL = 60;
const LAST_HOUR = 20;

export default function BrilliantFeed() {
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
    const components = generate_example_components(head_emails, set_task_id);
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

function generate_example_components() {
    return [
        {
            component: <HangingTasks />,
            title:
                'These urgent tasks have been in your todo list for over a week',
        },
        {
            component: (
                <OverdueTasks days_from_deadline={5} priority={URGENT} />
            ),
            title: 'These urgent tasks are due soon',
        },

        {
            component: <PriorityEmails priority={URGENT} />,
            title: 'Reply to urgent emails',
        },

        {
            component: <OverdueTasks days_from_deadline={0} />,
            title: 'These tasks are due today',
        },

        {
            component: <SuggestedTasks />,
            title: 'New suggested tasks',
        },
        {
            component: <ShortEmails />,
            title: 'Reply to short emails',
        },
        {
            component: <FollowupEmails />,
            title: 'Check up on past due responses',
        },
    ];
}
