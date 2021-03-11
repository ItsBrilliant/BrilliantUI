import React, { useState } from 'react'
import { Menu } from '../external/Menues'
import { GroupIcon } from '../mail/EmailStamp'
import PriorityOptions from '../PriorityOptions'
import { format_date } from '../../utils'
import Tags from './Tags'
import { TaskRowStyle } from './Tasks.style'
import { Update } from '../../actions/tasks'
import { useDispatch, useSelector } from 'react-redux'
import { Task } from '../../data_objects/Task'

export default function TaskRow(props) {
    //   const [multiselect_visible, set_visible] = useState(false);
    //onMouseEnter={() => set_visible(true)} onMouseLeave={() => set_visible(false)}
    const dispatch = useDispatch();
    const task_updater = (task) => dispatch(Update(task));
    const task_dict = useSelector(state => state.tasks);
    const status_options = ['To do', 'In progress', 'Pending', 'Done'];
    const deadline = format_date(props.deadline);
    const is_multiselected = props.multiselected_tasks.includes(props.task.id);

    const change_multi = (value, func) => {
        if (is_multiselected) {
            for (const id of props.multiselected_tasks) {
                Task.update_task(task_updater, task_dict[id], func, value);
            }
            //force re-render
            props.on_multiselect();
        } else {
            Task.update_task(task_updater, props.task, func, value);
        }
    }
    const change_status = (selected) => change_multi(selected.value, 'status');
    const change_priority = (value) => change_multi([value], 'set_priority');

    return (
        <TaskRowStyle is_multiselected={is_multiselected}>
            <span
                onClick={() => props.on_multiselect(props.task.id)} className="multiselect" />
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
