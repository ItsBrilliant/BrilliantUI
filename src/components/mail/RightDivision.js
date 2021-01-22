import React from 'react';
import './RightDivision.css';
import { get_priority_style, get_file_icon, format_date } from '../../utils.js';
import { useSelector } from 'react-redux';
import SimpleBar from 'simplebar-react';
import SingleTaskInfo from './SingleTaskInfo.js'
import { FileAttachments } from './FileAttachments.js'

export function RightDivision(thread, on_task_hover) {
    return (thread ?
        <div className='RightDivision'>
            <SimpleBar className='SimpleBar_RightDivision'>
                {Tasks(thread.get_tasks(), on_task_hover, thread)}
                {Participants(thread.get_participants())}
                {FileAttachments(thread.get_attachments())}
            </SimpleBar>
        </div> :
        null
    )
}

function Tasks(tasks, on_task_hover, thread) {
    const finished_tasks = tasks.filter(task => task.isDone);
    const active_tasks = tasks.filter(task => !task.isDone);
    if (finished_tasks.length === 0 && active_tasks.length === 0) {
        return null;
    } else {
        return (
            <div className='Container'>
                <SingleTaskInfo thread={thread} task={tasks[0]} />
                <TasksDisplayer tasks={active_tasks} areDone={false} on_hover={on_task_hover} />
                <TasksDisplayer tasks={finished_tasks} areDone={true} on_hover={on_task_hover} />
            </div>
        )
    }


}

function TasksDisplayer(props) {
    const user = useSelector(state => state.user);
    if (props.tasks.length === 0) {
        return null;
    }
    const title = props.areDone ? "Done" : "Priority Tasks"
    const done_style = props.areDone ? " done" : " not_done"
    const tasks_elements = props.tasks.map(task => {
        const owner_name = user === task.owner ? "You" : task.owner.get_first_name();
        return (
            <li onClick={() => props.on_hover(task)} className={get_priority_style(task.priority)}>
                <span className={"task_status_button"}
                    onClick={() => task.isDone = true}>
                    <span className="inner">v</span>
                </span>
                <span className={"task_owner" + done_style}>{owner_name}:</span>
                <span className="task_text">{task.text + " (due: " + format_date(task.deadline).date + ")"}</span>
            </li>
        );
    })
    return (
        <div className={'TasksDisplayer' + done_style}>
            <h4>{title}</h4>
            <ul>{tasks_elements}</ul>
        </div>
    );
}

function Participants(contacts) {
    if (contacts.includes(null)) {
        console.log("found null contact");
    }
    const icons = contacts.map(contact =>
        <div>
            <p className="contact_initials">{contact ? contact.get_initials() : ""}</p>
            <img src={contact.image_link} />
        </div>)

    return (
        <div className="Container">
            <h5>People in the Conversation</h5>
            <div className='ParticipantsIcons'>
                {icons}
            </div>
        </div>
    );
}
