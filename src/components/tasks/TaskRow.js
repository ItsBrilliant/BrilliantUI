import React from 'react'
import { Menu } from '../external/Menues'
import { GroupIcon } from '../mail/EmailStamp'
import PriorityOptions from '../PriorityOptions'
import { format_date } from '../../utils'
import Tags from './Tags'
import TaskRowStyle from './Tasks.style'

export default function TaskRow(props) {
    const status_options = ['To do', 'In progress', 'Pending', 'Done']
    const deadline = format_date(props.deadline)

    return (
        <TaskRowStyle>
            <span>{props.task_text}</span>
            <PriorityOptions default_selection={props.priority} />
            { GroupIcon([props.owner])}
            <Menu options={status_options}></Menu>
            { GroupIcon(props.watchers)}
            <span>{deadline.date} {deadline.time}</span>
            <Tags tags={props.tags}></Tags>
        </TaskRowStyle>
    )
}
