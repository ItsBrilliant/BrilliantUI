import React from 'react';
import { useTasks } from '../../hooks/redux';
import { SingleTaskStyle } from './TaskPost.style';
import { GroupIcon } from '../mail/EmailStamp';
import { ClockIcon, VerticalDots } from '../misc/svg_icons';
import { format_date } from '../../utils';
import OptionsButton from '../misc/OptionsButton';
import { get_priority_style } from '../../utils';
import FeedPost from './FeedPost';

export default function TaskPost(props) {
    const map_func = (tasks) =>
        tasks.map((t) => <SingleTask key={t.id} task={t} />);
    const buttons = ['Quick Solve All', 'Book Time'].map((b) => {
        return { name: b, action: () => {} };
    });
    return (
        <FeedPost
            items={props.tasks}
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
