import React, { useState, useEffect } from 'react';
import { useTasks } from '../../hooks/redux';
import FeedComponent from './FeedComponent';
import { GroupIcon } from '../mail/EmailStamp';
import {
    SuggestedTaskStyle,
    TaskSourceEmailStyle,
} from './SuggestedTasks.style';
import { Email } from '../../data_objects/Email';
import { MailIcon, VIcon } from '../misc/svg_icons';

import { render_task_highlights } from '../mail/task_highlights';
import { format_date, get_mouse_position_style } from '../../utils';
import { useDispatch } from 'react-redux';
import { Update } from '../../actions/tasks';
import { AddTaskPortal } from '../misc/AddTaskPortal';
import { Task } from '../../data_objects/Task';
import { group_tasks_by_source } from './utils';

const MAX_TASKS = 7;
var num_tasks = 0;
var tasks_for_approval;
export default function SuggestedTasks(props) {
    let tasks = useTasks('approve_status', undefined).slice(0, MAX_TASKS);
    useEffect(() => {
        tasks_for_approval = tasks.sort((t1, t2) => t1.priority - t2.priority);
        num_tasks = tasks.length;
    }, [num_tasks]);
    const dispatch = useDispatch();
    const task_updater = (task) => dispatch(Update(task));
    const [add_task_portal, set_portal] = useState(null);
    const [completed_suggestions, set_completed] = useState([]);
    const my_set_completed = (type) => {
        set_completed([...completed_suggestions, type]);
    };

    if (
        !tasks_for_approval ||
        tasks_for_approval.length <= completed_suggestions.length
    ) {
        console.log(completed_suggestions);
        return null;
    }
    const group_map = group_tasks_by_source(tasks_for_approval);
    const task_components = Object.keys(group_map).map((source_id) => {
        return (
            <CommonSourceSuggestions
                suggestions={group_map[source_id]}
                {...{ my_set_completed, set_portal, source_id }}
            />
        );
    });
    return (
        <>
            {add_task_portal}
            <FeedComponent>{task_components}</FeedComponent>
        </>
    );
}

function SuggestedTask(props) {
    const [suggestion_stats, set_status] = useState('pending');
    const pending_component = (
        <div className="task_content">
            <div className="task_header_row">
                {GroupIcon([props.task.initiator], 1, 32)}
                <span className="task_text">{props.task.text}</span>
                <TaskButtons
                    on_plus={(e) => {
                        props.on_plus(e, props.task, () =>
                            set_status('created')
                        );
                    }}
                    on_dismiss={() => {
                        props.on_dismiss();
                        set_status('dismissed');
                    }}
                />
            </div>
            {props.source_context}
        </div>
    );
    return (
        <SuggestedTaskStyle>
            {suggestion_stats === 'pending' ? (
                pending_component
            ) : (
                <CompletedSuggestion
                    task={props.task}
                    type={suggestion_stats}
                />
            )}
        </SuggestedTaskStyle>
    );
}

function TaskButtons(props) {
    return (
        <div className="TaskButtons">
            <button className="approve" onClick={props.on_plus}>
                +
            </button>
            <button className="decline" onClick={props.on_dismiss}>
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
        <TaskSourceEmailStyle>
            <MailIcon />
            <span className="email_left">
                <span className="subject">{props.email.get_subject()}</span>
                <span className="participants">{participants}</span>
            </span>
            <span className="timestamp">{date}</span>
        </TaskSourceEmailStyle>
    );
}

function CompletedSuggestion(props) {
    if (props.type !== 'created' && props.type !== 'dismissed') {
        return null;
    }
    return (
        <SuggestedTaskStyle type={props.type}>
            <div className="task_content">
                <div className="task_header_row completed_suggestion">
                    {GroupIcon([props.task.initiator], 1, 32)}
                    <span className="task_text">{props.task.text}</span>
                    <SuggestionSummary type={props.type} />
                </div>
            </div>
        </SuggestedTaskStyle>
    );
}

function SuggestionSummary(props) {
    let text = 'Dismissed';
    let icon = null;
    if (props.type === 'created') {
        text = 'Task created';
        icon = <VIcon />;
    }
    return (
        <span className="summary">
            {icon}
            <span className={'text ' + props.type}>{text}</span>
        </span>
    );
}

function CommonSourceSuggestions(props) {
    const dispatch = useDispatch();
    const task_updater = (task) => dispatch(Update(task));
    const my_set_add_task_portal = (e, task, on_approve) => {
        const on_close = () => props.set_portal(null);
        const on_ok = () => {
            on_approve();
            props.my_set_completed('created');
            on_close();
        };
        const position_style = get_mouse_position_style(e.pageX - 300, e.pageY);
        const portal = get_add_task_portal(
            task,
            position_style,
            task_updater,
            on_ok,
            on_close
        );
        props.set_portal(portal);
    };
    const source_email = Email.get_email_object_by_id(props.source_id);
    const invididual_suggestions = props.suggestions.map((task) => {
        const source_context = source_email ? (
            <div className="email_context">
                {render_task_highlights(
                    source_email.get_text().slice(0, task.source_indexes.end),
                    [task]
                )}
            </div>
        ) : null;
        return (
            <SuggestedTask
                key={task.id}
                task={task}
                source_context={source_context}
                on_plus={my_set_add_task_portal}
                on_dismiss={() => {
                    Task.update_task(
                        task_updater,
                        task,
                        'approve_status',
                        'declined'
                    );
                    props.my_set_completed('declined');
                }}
            />
        );
    });
    return (
        <>
            <TaskSourceEmail email={source_email} />
            {invididual_suggestions}
        </>
    );
}

function get_add_task_portal(
    task,
    position_style,
    task_updater,
    on_ok,
    on_close
) {
    return (
        <AddTaskPortal
            style={position_style}
            task_updater={task_updater}
            handle_ok={on_ok}
            handle_close={on_close}
            priority={task.priority}
            task_text={task.text}
            date={task.deadline}
            task={task}
        />
    );
}
