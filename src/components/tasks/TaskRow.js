import React from 'react'
import { Menu } from '../external/Menues'
import { GroupIcon } from '../mail/EmailStamp'
import PriorityOptions from '../PriorityOptions'
import { format_date } from '../../utils'
import Tags from './Tags'
import { TaskRowStyle } from './Tasks.style'
import { Update } from '../../actions/tasks'
import { useDispatch } from 'react-redux'
import { Task } from '../../data_objects/Task'

export default function TaskRow(props) {
    const status_options = ['To do', 'In progress', 'Pending', 'Done']
    const deadline = format_date(props.deadline)
    const dispatch = useDispatch();
    const task_updater = (task) => dispatch(Update(task));
    const change_status = (selected) => Task.update_task(task_updater, props.task, 'set_status', [selected.value]);
    const change_priority = (value) => Task.update_task(task_updater, props.task, 'set_priority', [value]);
    return (
        <TaskRowStyle>
            <span className="task_text"
                onClick={() => props.on_click(props.task)}
            > {props.task_text}</span>
            <PriorityOptions style_class="priority" default_selection={props.priority} onChange={change_priority} />
            <span className="owner">{GroupIcon([props.owner], 6, 35)}</span>
            <Menu style_class="status" value={props.status} options={status_options} onChange={change_status}></Menu>
            <span className="watchers">{GroupIcon(props.watchers, 6, 35, 20)}</span>
            <span className="deadline">{deadline.date} {deadline.time}</span>
            <Tags tags={props.tags}></Tags>
        </TaskRowStyle>
    )
}