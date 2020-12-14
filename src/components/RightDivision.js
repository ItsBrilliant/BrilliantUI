import React from 'react';
import './RightDivision.css';
import { get_priority_style, get_file_icon, format_date } from '../utils.js';


export function RightDivision(thread) {
    return (
        <div className='RightDivision'>
            {Tasks(thread.get_tasks())}
            {Participants(thread.get_participants())}
            {FileAttachments(thread.get_attachments())}
        </div>
    )
}

function Tasks(tasks) {
    const finished_tasks = tasks.filter(task => task.isDone);
    const active_tasks = tasks.filter(task => !task.isDone);
    if (finished_tasks.length === 0 && active_tasks.length === 0) {
        return null;
    } else {
        return (
            <div className='Container'>
                {TasksDisplayer(active_tasks, false)}
                {TasksDisplayer(finished_tasks, true)}
            </div>
        )
    }


}

function TasksDisplayer(tasks, areDone) {
    if (tasks.length === 0) {
        return null;
    }
    const title = areDone ? "Finished Tasks" : "Priority Tasks"
    const tasks_elements = tasks.map(task => <li className={get_priority_style(task.priority)}>
        {task.text + " (" + format_date(task.deadline).date + ")"}
    </li>)
    return (
        <div className='TasksDisplayer'>
            <h4>{title}</h4>
            <ul>{tasks_elements}</ul>
        </div>
    );
}

function Participants(contacts) {
    const icons = contacts.map(contact =>
        <div>
            <p className="contact_initials">{contact.get_initials()}</p>
            <img src={contact.image_link} />
        </div>)

    return (
        <div className="Container">
            <h4>People in the Conversation</h4>
            <div className='ParticipantsIcons'>
                {icons}
            </div>
        </div>
    );
}

function FileAttachments(attachments) {
    if (attachments.length === 0) {
        return null;
    }
    const attachemnts_for_display = attachments.map(a => AttachmentDisplay(a))
    return (
        <div className="Container">
            <h4>Attached Files</h4>
            <div className='AttachmentsDisplay'>
                {attachemnts_for_display}
            </div>
        </div>
    )
}

function AttachmentDisplay(file_name) {
    const splitted = file_name.split('.')
    var extension = splitted[splitted.length - 1]
    const icon = get_file_icon(extension)
    return (
        <div className='TitledImage'>
            <img src={icon} title={file_name}></img>
            <p>{file_name}</p>
        </div>
    )
}
