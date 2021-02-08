import React, { useState, useEffect } from 'react';
import './RightDivision.css';
import { get_priority_style, format_date } from '../../utils.js';
import { useSelector, useDispatch } from 'react-redux';
import SimpleBar from 'simplebar-react';
import TaskInfoWrapper from './SingleTaskInfo.js'
import { FileAttachments } from './FileAttachments.js'
import { Update } from '../../actions/tasks'
import { Task } from '../../data_objects/Task'

export function RightDivision(props) {
    const tasks = useSelector(state => Object.values(state.tasks))
    const thread = props.thread;
    return (thread ?
        <div className='RightDivision'>
            <SimpleBar className='SimpleBar_RightDivision'>
                <Tasks tasks={tasks.filter(t => t.get_thread_id() === thread.get_id() && t.is_approved())} thread={thread} />
                {Participants(thread.get_participants())}
                {FileAttachments(thread.get_attachments())}
            </SimpleBar>
        </div> :
        null
    )
}

function Tasks(props) {
    const dispatch = useDispatch();
    const task_updater = (task) => dispatch(Update(task));

    //Old function used to highlight
    const on_task_click = props.on_task_click;
    const [task_id_for_info, set_task_id] = useState(null);
    const finished_tasks = props.tasks.filter(task => task.isDone);
    const active_tasks = props.tasks.filter(task => !task.isDone);
    const my_update_finished_task = (task) => {
        Task.update_task(task_updater, task, 'set_status', ["Done"]);
    }

    if (finished_tasks.length === 0 && active_tasks.length === 0) {
        return null;
    } else {
        return (
            <div className='Container'>
                <TaskInfoWrapper thread={props.thread}
                    task_id={task_id_for_info}
                    close={() => set_task_id(null)} />
                <TasksDisplayer tasks={active_tasks} areDone={false} on_status_click={my_update_finished_task} on_click={set_task_id} />
                <TasksDisplayer tasks={finished_tasks} areDone={true} on_click={set_task_id} />
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
            <li className={get_priority_style(task.priority)}>
                <span className={"task_status_button"}
                    onClick={() => { if (props.on_status_click) { props.on_status_click(task); } }}>
                    <span className="inner">v</span>
                </span>
                <span className={"task_owner" + done_style}>{owner_name}:</span>
                <span onClick={() => props.on_click(task.get_id())} className="task_text">{task.text}</span>
            </li>
        );
    })
    //show deadline ->      + " (due: " + format_date(task.deadline).date + ")"
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
