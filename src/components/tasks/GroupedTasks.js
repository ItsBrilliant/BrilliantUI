import React from 'react'
import { PRIORITIES } from '../../data_objects/Consts'
import TaskRow from './TaskRow';
import { GroupedTasksStyle } from './Tasks.style'

export default function GroupedTasks(props) {
    const title = PRIORITIES[props.priority];
    const tasks = props.tasks.map(t =>
        <TaskRow
            key={t.id}
            task={t}
            task_text={t.text}
            deadline={t.deadline}
            owner={t.owner}
            watchers={Array.from(t.watchers)}
            tags={t.tags}
            priority={props.priority}
            status={t.status}
        />
    );
    return (
        tasks.length === 0 ? null :
            <GroupedTasksStyle priority={props.priority}>
                <p>{title}</p>
                {tasks}
            </GroupedTasksStyle>
    )
}
