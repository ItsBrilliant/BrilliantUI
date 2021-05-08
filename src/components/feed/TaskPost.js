import React from 'react';
import { useTasks } from '../../hooks/redux';
import { SingleTaskStyle } from './TaskPost.style';
import { GroupIcon } from '../mail/EmailStamp';
import { ClockIcon, VerticalDots } from '../misc/svg_icons';
import { format_date } from '../../utils';
import OptionsButton from '../misc/OptionsButton';
import { get_priority_style } from '../../utils';

export default function TaskPost(props) {
    const task_components = props.tasks.map((t) => <SingleTask task={t} />);
    return <div>{task_components}</div>;
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
