import React, { useState } from 'react';
import './RightDivision.css';
import { get_priority_style, format_date } from '../../utils.js';
import { useSelector } from 'react-redux';
import SimpleBar from 'simplebar-react';
import TaskInfoWrapper from './SingleTaskInfo.js'
import { FileAttachments } from './FileAttachments.js'

export function RightDivision(thread, on_task_click) {
    return (thread ?
        <div className='RightDivision'>
            <SimpleBar className='SimpleBar_RightDivision'>
                <Tasks tasks={thread.get_tasks()} on_task_click={on_task_click} thread={thread} />
                {Participants(thread.get_participants())}
                {FileAttachments(thread.get_attachments())}
            </SimpleBar>
        </div> :
        null
    )
}

function Tasks(props) {
    //Old function used to highlight
    const on_task_click = props.on_task_click;
    const [info_visible, set_visible] = useState(false);
    const [task_for_info, set_task] = useState(props.tasks[0]);
    const finished_tasks = props.tasks.filter(task => task.isDone);
    const active_tasks = props.tasks.filter(task => !task.isDone);
    const my_set_task_info = (task) => {
        set_task(task);
        set_visible(true);
    }
    if (finished_tasks.length === 0 && active_tasks.length === 0) {
        return null;
    } else {
        return (
            <div className='Container'>
                <TaskInfoWrapper thread={props.thread}
                    task={task_for_info}
                    visible={info_visible}
                    close={() => set_visible(false)} />
                <TasksDisplayer tasks={active_tasks} areDone={false} on_click={my_set_task_info} />
                <TasksDisplayer tasks={finished_tasks} areDone={true} on_click={my_set_task_info} />
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
            <li onClick={() => props.on_click(task)} className={get_priority_style(task.priority)}>
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
