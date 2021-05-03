import React, { useState } from 'react';
import { useTasks } from '../../hooks/redux';
import FeedComponent from './FeedComponent';
import { GroupIcon } from '../mail/EmailStamp';
import { SuggestedTaskStyle } from './SuggestedTasks.style';
import { Email } from '../../data_objects/Email';
import { MailIcon } from '../misc/svg_icons';
import { email_container_background } from '../misc/StyleConsts';
import { render_task_highlights } from '../mail/task_highlights';
import { format_date, get_mouse_position_style } from '../../utils';
import { useDispatch } from 'react-redux';
import { Update } from '../../actions/tasks';
import { AddTaskPortal } from '../misc/AddTaskPortal';
import { Task } from '../../data_objects/Task';
const MAX_TASKS = 13;

export default function SuggestedTasks(props) {
    const dispatch = useDispatch();
    const task_updater = (task) => dispatch(Update(task));
    const [add_task_portal, set_portal] = useState(null);
    const my_set_add_task_portal = (e, task) => {
        const position_style = get_mouse_position_style(e.pageX - 300, e.pageY);
        const portal = get_add_task_portal(
            task,
            position_style,
            task_updater,
            () => set_portal(null)
        );
        set_portal(portal);
    };
    const tasks_for_approval = useTasks('approve_status', undefined).slice(
        0,
        MAX_TASKS
    );
    if (tasks_for_approval.length === 0) {
        return null;
    }
    const task_components = tasks_for_approval.map((t) => (
        <SuggestedTask
            on_plus_click={(e) => my_set_add_task_portal(e, t)}
            on_dismiss_click={() => {
                Task.update_task(task_updater, t, 'approve_status', 'declined');
                alert('declined');
            }}
            task={t}
        />
    ));
    return (
        <>
            {add_task_portal}
            <div>{task_components}</div>
        </>
    );
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
                    <TaskButtons
                        on_approve={props.on_plus_click}
                        on_decline={props.on_dismiss_click}
                    />
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

function get_add_task_portal(task, position_style, task_updater, on_close) {
    return (
        <AddTaskPortal
            style={position_style}
            task_updater={task_updater}
            handle_ok={on_close}
            handle_close={on_close}
            priority={task.priority}
            task_text={task.text}
            date={task.deadline}
            task={task}
        />
    );
}
