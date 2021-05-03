import React from 'react';
import { useTasks } from '../../hooks/redux';
import FeedComponent from './FeedComponent';
import { GroupIcon } from '../mail/EmailStamp';
import { SuggestedTaskStyle } from './SuggestedTasks.style';
import { Email } from '../../data_objects/Email';
import { MailIcon } from '../misc/svg_icons';
import { email_container_background } from '../misc/StyleConsts';
import { render_task_highlights } from '../mail/task_highlights';
import { format_date } from '../../utils';
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

    const source_context = source_email ? (
        <div className="email_context">
            {render_task_highlights(
                source_email.get_text().slice(0, props.task.source_indexes.end),
                [props.task]
            )}
        </div>
    ) : null;
    return (
        <SuggestedTaskStyle>
            <TaskSourceEmail email={source_email} />
            <div className="task_content">
                <div className="upper_row">
                    {GroupIcon([props.task.initiator], 1, 32)}
                    <span className="task_text">{props.task.text}</span>
                    <TaskButtons />
                </div>
                {source_context}
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

function TaskSourceEmail(props) {
    if (!props.email) {
        return null;
    }
    const date = format_date(props.email.get_date()).date;
    const participants = [
        props.email.get_sender(),
        ...props.email.get_receivers(),
    ]
        .slice(0, 3)
        .map((p) => p.get_name())
        .join(', ');
    return (
        <div className="TaskSourceEmail">
            <MailIcon />
            <span className="email_left">
                <span className="subject">{props.email.get_subject()}</span>
                <span className="participants">{participants}</span>
            </span>
            <span className="timestamp">{date}</span>
        </div>
    );
}
