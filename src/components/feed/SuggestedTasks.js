import React from 'react';
import { useTasks } from '../../hooks/redux';
import FeedComponent from './FeedComponent';
import { GroupIcon } from '../mail/EmailStamp';
import { SuggestedTaskStyle } from './SuggestedTasks.style';
import { Email } from '../../data_objects/Email';
import { MailIcon } from '../misc/svg_icons';
const MAX_TASKS = 3;

export default function SuggestedTasks(props) {
    const tasks_for_approval = useTasks('approve_status', undefined).slice(
        0,
        MAX_TASKS
    );
    if (tasks_for_approval.length === 0) {
        return null;
    }
    const task_components = tasks_for_approval.map((t) => (
        <SuggestedTask task={t} />
    ));
    return <div>{task_components}</div>;
}

function SuggestedTask(props) {
    const source_email = Email.get_email_object_by_id(
        props.task.get_email_id()
    );
    const source_subject = source_email ? (
        <div className="task_source">
            <MailIcon />
            <span>{source_email.get_subject()}</span>{' '}
        </div>
    ) : null;
    return (
        <SuggestedTaskStyle>
            {source_subject}
            <div className="task_content">
                {GroupIcon([props.task.initiator], 1, 32)}
                <span className="task_text">{props.task.text}</span>
                <TaskButtons />
            </div>
        </SuggestedTaskStyle>
    );
}

function TaskButtons(props) {
    return (
        <div className="TaskButtons">
            <button className="approve" onClick={props.on_approve}>
                +
            </button>
            <button className="decline" onClick={props.on_decline}>
                Dismiss
            </button>
        </div>
    );
}
