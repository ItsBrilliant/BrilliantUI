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
import { Task } from '../../data_objects/Task';
import { group_tasks_by_source } from './utils';
import { white_lilac } from '../misc/StyleConsts';
import { get_add_task_portal, sort_task_by_priority_time } from './utils';

const MAX_TASKS = 7;
export default function SuggestedTasks(props) {
    const [tasks_for_suggestion, set_tasks_for_suggestion] = useState([]);
    let tasks = useTasks(['approve_status', 'meeting'], [undefined, undefined]);
    tasks = tasks
        .filter((t) => !tasks_for_suggestion.includes(t))
        .sort(sort_task_by_priority_time)
        .slice(0, MAX_TASKS - tasks_for_suggestion.length);
    const tasks_union = [...tasks_for_suggestion, ...tasks];
    const current_num_tasks = tasks_union.length;
    useEffect(() => {
        if (current_num_tasks > tasks_for_suggestion.length) {
            set_tasks_for_suggestion(
                tasks_union.sort((t1, t2) => t1.priority - t2.priority)
            );
        }
    }, [tasks_for_suggestion]);
    const [add_task_portal, set_portal] = useState(null);
    const [num_completed_suggestions, set_num_completed] = useState(0);
    const complete_suggestion = () =>
        set_num_completed(num_completed_suggestions + 1);

    if (
        !tasks_for_suggestion ||
        num_completed_suggestions >= tasks_for_suggestion.length
    ) {
        return null;
    }
    const group_map = group_tasks_by_source(tasks_for_suggestion);
    const task_components = Object.keys(group_map).map((source_id) => {
        return (
            <CommonSourceSuggestions
                suggestions={group_map[source_id]}
                {...{ complete_suggestion, set_portal, source_id }}
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
        return (
            <span style={{ color: white_lilac, width: '100%' }}>
                Unknown source
            </span>
        );
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

function CompletedSource(props) {
    return (
        <SuggestedTaskStyle type={'completed_source'}>
            <div className="task_content">
                <div className="task_header_row completed_source">
                    <span className="task_text">
                        Tasks created successfully
                    </span>
                    <span className={'completed_source_actions'}>
                        <button className="send">
                            {'Send Update & Links'}
                        </button>
                        <button className="close">&times;</button>
                    </span>
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
    const [completed_suggestions, set_completed] = useState([]);
    const dispatch = useDispatch();
    const task_updater = (task) => dispatch(Update(task));
    const my_set_completed = (type) => {
        setTimeout(() => {
            const updated_completed_suggestions = [
                ...completed_suggestions,
                type,
            ];
            set_completed(updated_completed_suggestions);
            props.complete_suggestion();
            console.log(updated_completed_suggestions);
        }, 1000);
    };
    const my_set_add_task_portal = (e, task, on_approve) => {
        const on_close = () => props.set_portal(null);
        const on_create_task = () => {
            on_approve();
            my_set_completed('created');
        };
        const position_style = get_mouse_position_style(e.pageX - 300, e.pageY);
        const portal = get_add_task_portal(
            task,
            position_style,
            task_updater,
            on_create_task,
            on_close
        );
        props.set_portal(portal);
    };

    const my_dismiss_task = (task) => {
        Task.update_task(task_updater, task, 'approve_status', 'declined');
        my_set_completed('declined');
    };
    const source_email = Email.get_email_object_by_id(props.source_id);
    const num_incomplete =
        props.suggestions.length - completed_suggestions.length;
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
                on_dismiss={() => my_dismiss_task(task)}
            />
        );
    });
    const completed_source = completed_suggestions.includes('created') ? (
        <CompletedSource email={source_email} />
    ) : null;
    const result =
        num_incomplete > 0 ? invididual_suggestions : completed_source;
    return (
        <div style={{ marginBottom: '20px', width: '100%' }}>
            <TaskSourceEmail email={source_email} />
            {result}
        </div>
    );
}
