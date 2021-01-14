import React from 'react';
import './RightDivision.css';
import { get_priority_style, get_file_icon, format_date } from '../../utils.js';
import { download_attachment } from '../../backend/Connect.js';
import { useSelector } from 'react-redux';

export function RightDivision(thread, on_task_hover) {
    return (thread ?
        <div className='RightDivision'>
            {Tasks(thread.get_tasks(), on_task_hover)}
            {Participants(thread.get_participants())}
            {FileAttachments(thread.get_attachments())}
        </div> :
        null
    )
}

function Tasks(tasks, on_task_hover) {
    const finished_tasks = tasks.filter(task => task.isDone);
    const active_tasks = tasks.filter(task => !task.isDone);
    if (finished_tasks.length === 0 && active_tasks.length === 0) {
        return null;
    } else {
        return (
            <div className='Container'>
                {TasksDisplayer(active_tasks, false, on_task_hover)}
                {TasksDisplayer(finished_tasks, true, on_task_hover)}
            </div>
        )
    }


}

function TasksDisplayer(tasks, areDone, on_hover) {
    if (tasks.length === 0) {
        return null;
    }
    const title = areDone ? "Finished Tasks" : "Priority Tasks"
    const tasks_elements = tasks.map(task => <li onClick={() => on_hover(task)} className={get_priority_style(task.priority)}>
        {task.text + " (due: " + format_date(task.deadline).date + ")"}
    </li>)
    return (
        <div className='TasksDisplayer'>
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
    const attachemnts_for_display = attachments.map(a => <AttachmentDisplay attachment={a} />);
    return (
        <div className="Container">
            <h4>Attached Files</h4>
            <div className='AttachmentsDisplay'>
                {attachemnts_for_display}
            </div>
        </div>
    )
}

function AttachmentDisplay(props) {
    const user = useSelector(state => state.user);
    const file_name = props.attachment.name;
    const splitted = file_name.split('.');
    var extension = splitted[splitted.length - 1];
    const icon = get_file_icon(extension);
    return (
        <div className='TitledImage'
            onClick={() => download_attachment(props.attachment.email_id, props.attachment.id, user)}
        >
            <img src={icon} title="download"></img>
            <p>{file_name}</p>
        </div>
    )
}
