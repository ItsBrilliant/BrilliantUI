import React, { useState } from 'react';
import { useTasks, useThreads, useEmails } from '../../hooks/redux';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { SelectThread } from '../../actions/email_threads';
import { QuickReply } from '../tasks/SingleTaskInfo';
import { send_quick_reply } from '../misc/email_composer_utils.js';
import { EmailComposer } from '../misc/EmailComposer';
import EmailTextArea from '../mail/EmailTextArea';
import {
    URGENT,
    ALL_FOLDERS_MAGIC,
    PRIORITIES,
} from '../../data_objects/Consts';
import EmailThread from '../mail/EmailThread';
import FeedComponent from '../feed/FeedComponent';
import FeedElement from './FeedElement';
import { format_date, is_same_day } from '../../utils';
import { CalendarTask } from '../calendar/CalendarTasks';
import EmailContainer from '../mail/EmailContainer';
import { IncrementalStyle } from './Feed.style';

export function UrgentEmails(props) {
    const dispatch = useDispatch();
    const history = useHistory();
    let threads = useThreads();
    threads = threads.filter(
        (t) => t.has_unread() && t.get_priority() === props.priority
    );
    if (threads.length === 0) {
        return null;
    }
    const count = props.max_threads ? props.max_threads : 3;
    threads = threads.slice(0, count);
    const my_handle_select = (id) => {
        dispatch(SelectThread(id));
        history.push('mail');
    };
    const thread_components = threads.map((thread) => (
        <EmailThread
            key={thread.id}
            id={thread.id}
            thread={thread}
            is_selected={false}
            handle_select={my_handle_select}
            priority={props.priority}
            options_offset={{ top: 0, left: 15 }}
        />
    ));
    return (
        <FeedComponent
            buttons={[]}
            component={<div className="UrgentEmails">{thread_components}</div>}
        />
    );
}

export function NextMeeting(props) {
    const time_span =
        format_date(props.event.start).time +
        '-' +
        format_date(props.event.end).time;
    const description = props.event.description ? (
        <p>{'Agenda: ' + props.event.description}</p>
    ) : null;
    const location = props.event.location ? (
        <p>{'At: ' + props.event.location}</p>
    ) : null;
    const meeting_component = (
        <div>
            <h4>{props.event.subject + ' (' + time_span + ')'}</h4>
            {description}
            {location}
        </div>
    );
    const buttons = [
        'Edit Agenda',
        'Send Reminder',
        'Reschedule',
        'Enter Call',
    ].map((b) => {
        return { name: b, action: () => {} };
    });
    return (
        <FeedComponent
            buttons={buttons}
            component={<div className="NextMeeting">{meeting_component}</div>}
        />
    );
}

export function OverdueTasks(props) {
    let tasks = useTasks(
        ['deadline', 'status', 'priority'],
        [props.reference_time, 'Done', props.priority],
        [(a, b) => is_same_day(a, b), (a, b) => a !== b, (a, b) => a === b]
    );
    //  tasks = tasks.sort((a, b) => a.priority - b.priority);
    if (tasks.length === 0) {
        return null;
    }
    const tasks_component = tasks.map((t) => (
        <CalendarTask
            key={t.id}
            task={t}
            priority={t.priority}
            owner={t.owner}
            watching={t.watchers}
            title={t.text}
            deadline={format_date(t.deadline).time}
            on_select={props.on_select}
        />
    ));
    const buttons = [
        'Change Priority',
        'Book Time',
        'Reassign',
        'Change Status',
    ].map((b) => {
        return { name: b, action: () => {} };
    });
    return (
        <FeedComponent
            buttons={buttons}
            component={<div className="OverdueTasks">{tasks_component}</div>}
        />
    );
}

export function UnfinishedDrafts(props) {
    const [dummy, set_dummy] = useState(0);
    let emails = props.emails.filter((e) => e.is_draft());
    const buttons = ['Continue', 'Discard'].map((b) => {
        return {
            name: b,
            action: () => {
                set_dummy(dummy + 1);
                alert(emails.length);
            },
        };
    });
    const pages = emails.map((email) => (
        <EmailTextArea
            isUnread={true}
            content={email.get_text()}
            subject={email.get_subject()}
            tags={[]}
            email={email}
            tasks={[]}
        />
    ));

    return (
        <FeedComponent
            buttons={buttons}
            component={
                <div className="UnfinishedDrafts">
                    {<IncrementalFeedComponent pages={pages} />}
                </div>
            }
        />
    );
}

export function QuickReplyFeed(props) {
    const [emails, set_emails] = useState(props.emails);
    const COMPOSER_ID = -2; //has to be different from the -1 in task view page otherwise will crash
    const buttons = [];
    const remove_email = (id) => {
        set_emails(emails.filter((e) => e.get_id() !== id));
    };
    const pages = emails.map((email) => (
        <div>
            <EmailContainer key={email.get_id()} email={email} />
            <EmailComposer
                only_content={true}
                id={COMPOSER_ID}
                email_attributes={{
                    composer_type: 'quick_reply',
                    email_id: email.get_id(),
                }}
                content_title="Reply"
                send={send_quick_reply}
                on_close={() => remove_email(email.get_id())}
            />
        </div>
    ));

    return (
        <FeedComponent
            buttons={buttons}
            component={
                <div className="QuickReplyFeed">
                    {<IncrementalFeedComponent pages={pages} />}
                </div>
            }
        />
    );
}

export function IncrementalFeedComponent(props) {
    const [index, set_index] = useState(0);
    const max = props.pages.length - 1;
    if (max === -1) {
        return null;
    }
    const increment = () => {
        if (index < max) {
            set_index(index + 1);
        }
    };

    const decrement = () => {
        if (index > 0) {
            set_index(index - 1);
        }
    };

    const current_page = props.pages[index];
    let indicators = [];
    for (let i = 0; i < props.pages.length; i++) {
        const style = index === i ? 'selected' : null;
        indicators.push(<span className={style} />);
    }

    return (
        <IncrementalStyle>
            {current_page}
            <div className="indicators">
                <button onClick={decrement}>{'<'}</button>
                {indicators}
                <button onClick={increment}>{'>'}</button>
            </div>
        </IncrementalStyle>
    );
}
