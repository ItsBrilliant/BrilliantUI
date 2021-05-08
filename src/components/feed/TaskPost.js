import React from 'react';
import { SingleTaskStyle } from './TaskPost.style';
import { GroupIcon } from '../mail/EmailStamp';
import { ClockIcon, VerticalDots } from '../misc/svg_icons';
import { get_priority_style } from '../../utils';
import FeedPost from './FeedPost';
import { format_date } from '../../utils';
import { AddTaskPortal } from '../misc/AddTaskPortal';

export default function TaskPost(props) {
    const sorted_tasks = props.tasks.sort(sort_task_by_priority_time);
    const map_func = (tasks) =>
        tasks.map((t) => <SingleTask key={t.id} task={t} />);
    const buttons = ['Quick Solve All', 'Book Time'].map((b) => {
        return { name: b, action: () => {} };
    });
    return (
        <FeedPost
            items={sorted_tasks}
            map_to_components={map_func}
            default_limit={2}
            expanded_limit={5}
            buttons={buttons}
            type="tasks"
        />
    );
}

function SingleTask(props) {
    const deadline = format_date(props.task.deadline).date;
    const priority_style = get_priority_style(props.task.priority);
    return (
        <SingleTaskStyle>
            <div className="left_section">
                <div className="task_title">{props.task.text}</div>
                <div className="task_info">
                    <span className="owner">
                        {GroupIcon([props.task.initiator], 1, 28)}
                    </span>
                    <span className="dot" />
                    <span className="watchers">
                        {GroupIcon(props.task.watchers, 5, 28, 20)}
                    </span>
                    <span className="dot" />
                    <span className="deadline">
                        <ClockIcon />
                        {deadline}
                    </span>
                    <span className="dot" />
                    <span className="status">{props.task.status}</span>
                </div>
            </div>
            <div className="right_section">
                <span className={'priority ' + priority_style} />
                <VerticalDots />
            </div>
        </SingleTaskStyle>
    );
}

export function sort_task_by_priority_time(a, b) {
    const priority_diff = a.priority - b.priority;
    if (priority_diff !== 0) {
        return priority_diff;
    } else {
        return b.creation_time - a.creation_time;
    }
}

export function get_add_task_portal(
    task,
    position_style,
    task_updater,
    on_create_task,
    on_close
) {
    const handle_ok = (text, date, priority, owner) => {
        task.text = text;
        task.priority = priority;
        task.deadline = date;
        task.owner = owner;
        task.approve_status = 'approved';
        task_updater(task);
        on_create_task();
    };
    return (
        <AddTaskPortal
            style={position_style}
            task_updater={task_updater}
            handle_ok={handle_ok}
            handle_close={on_close}
            priority={task.priority}
            task_text={task.text}
            date={task.deadline}
            task={task}
        />
    );
}
