import React from 'react'
import { PRIORITIES } from '../../data_objects/Consts'
import TaskRow from './TaskRow';

export default function GroupedTasks(props) {
    const title = PRIORITIES[props.priority];
    const tasks = props.tasks.map(t =>
        <TaskRow
            key={t.id}
            task_text={t.text}
            deadline={t.deadline}
            owner={t.owner}
            watchers={Array.from(t.watchers)}
            tags={t.tags}
            priority={t.priority}
        />
    );
    return (
        <div>
            <p>{title}</p>
            {tasks}
        </div>
    )
}
