import React, { useState } from 'react'
import './CalendarTasks.css'
import { Menu } from '../external/Menues'
import OptionsButton from '../OptionsButton'
import { format_date, get_priority_style } from '../../utils'
import { GroupIcon } from '../mail/EmailStamp'
import { Contact } from '../../data_objects/Contact'
import SimpleBar from 'simplebar-react'
import { useSelector } from 'react-redux'
import TaskInfoWrapper from '../mail/SingleTaskInfo'

export default function CalendarTasks() {
    const [sort_type, set_sort] = useState("Priority")
    const [selected_task, set_task] = useState(null)
    let tasks = useSelector(state => Object.values(state.tasks));
    tasks = tasks.sort((a, b) => a.priority - b.priority);
    const threads = useSelector(state => state.email_threads);
    const selected_thread = selected_task ? threads[selected_task.get_thread_id()] : null
    const task_components = tasks.map(task => {
        const thread = threads[task.get_thread_id()];
        let participants = thread ? thread.get_participants() : [];
        participants = participants.filter(p => p !== task.owner)
        return (
            <CalendarTask
                key={task.get_id()}
                task={task}
                priority={task.priority}
                owner={task.owner}
                watching={participants}
                title={task.text}
                deadline={format_date(task.deadline).date}
                on_select={set_task}
            />);
    })
    return (

        <div className="CalendarTasks">
            <Header sort_type={sort_type}
                handle_sorting={set_sort}
                button_text={"..."}
                title={"Tasks"}
                sort_options={['Priority', 'Deadline']}
            />
            <div className="calendar_tasks_wrapper">
                <SimpleBar className="simple_bar">
                    {task_components}
                </SimpleBar>
            </div>
            <TaskInfoWrapper thread={selected_thread}
                task={selected_task}
                close={() => set_task(null)} />
        </div>
    )
}

export function Header(props) {
    const button = props.button_text ? <button className="header_button">{"..."}</button> : null
    return (
        <div className="header">
            <span className="header_title">{props.title}</span>
            {button}
            <Menu options={props.sort_options} label='Sort: ' value={props.sort_type} onChange={props.handle_sorting} />
        </div>
    )
}

function CalendarTask(props) {
    var button_options = ["Quick Reply", "Set In Calendar", "Add To Topic", "Go To Source", "Mark As Done"]
    button_options = button_options.map(o => { return { name: o } });
    const priority_style = get_priority_style(props.priority);
    return (
        <div className="CalendarTask">
            <span className="title" onClick={() => props.on_select(props.task)}>{props.title}</span>
            <span className={"priority " + priority_style}></span>
            <span className="deadline">{props.deadline}</span>
            <span className="options"><OptionsButton options={button_options} offset={{ top: 0, left: -150 }} /></span>
            <span className="owner">{GroupIcon([props.owner], 1, 40)}</span>
            <span className="watching">{GroupIcon(props.watching, 4, 35, 25)}</span>

        </div>
    )
}
