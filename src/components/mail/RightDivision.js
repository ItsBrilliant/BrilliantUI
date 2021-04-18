import React, { useState, useEffect } from 'react';
import './RightDivision.css';
import { get_priority_style, format_date } from '../../utils.js';
import { useSelector, useDispatch } from 'react-redux';
import SimpleBar from 'simplebar-react';
import TaskInfoWrapper from '../tasks/SingleTaskInfo.js';
import { FileAttachments } from './FileAttachments.js';
import { SelectTask, Update } from '../../actions/tasks';
import { Task } from '../../data_objects/Task';

export function RightDivision(props) {
    const tasks = useSelector((state) => Object.values(state.tasks));
    const thread = props.thread;
    let style = 'RightDivision';
    if (props.collapsed_right) {
        style += ' collapsed_right';
    }
    return thread && props.show ? (
        <div className={style}>
            <SimpleBar className="SimpleBar_RightDivision">
                <Tasks
                    tasks={tasks.filter(
                        (t) => t.thread_id === thread.id && t.approved()
                    )}
                    thread={thread}
                />
                {Participants(thread.get_participants())}
                {FileAttachments(thread.get_attachments())}
            </SimpleBar>
        </div>
    ) : null;
}

function Tasks(props) {
    const dispatch = useDispatch();
    const task_updater = (task) => dispatch(Update(task));
    const set_task_id = (id) => dispatch(SelectTask(id));
    const selected_task_id = useSelector((state) => state.selected_task_id);
    const finished_tasks = props.tasks.filter((task) => task.is_done());
    const active_tasks = props.tasks.filter((task) => !task.is_done());
    const my_update_finished_task = (task) => {
        Task.update_task(task_updater, task, 'status', 'Done');
    };

    return (
        <div className="Container">
            <TaskInfoWrapper
                thread_id={props.thread.id}
                task_id={selected_task_id}
                close={() => set_task_id(null)}
            />
            <TasksDisplayer
                tasks={active_tasks}
                areDone={false}
                on_status_click={my_update_finished_task}
                on_click={set_task_id}
            />
            <TasksDisplayer
                tasks={finished_tasks}
                areDone={true}
                on_click={set_task_id}
            />
        </div>
    );
}

function TasksDisplayer(props) {
    const user = useSelector((state) => state.user.contact);
    const empty = props.tasks.length === 0;
    if (empty && props.areDone) {
        return null;
    }
    const title = props.areDone ? 'Done' : 'Priority Tasks';
    const done_style = props.areDone ? ' done' : ' not_done';
    const body = empty ? (
        <h5>No tasks yet</h5>
    ) : (
        <ul>
            {props.tasks.map((task) => {
                const owner_name =
                    user === task.owner ? 'You' : task.owner.get_first_name();
                return (
                    <li
                        key={task.id}
                        className={get_priority_style(task.priority)}
                    >
                        <span
                            className={'task_status_button'}
                            onClick={() => {
                                if (props.on_status_click) {
                                    props.on_status_click(task);
                                }
                            }}
                        >
                            <span className="inner">v</span>
                        </span>
                        <span className={'task_owner' + done_style}>
                            {owner_name}:
                        </span>
                        <span
                            onClick={() => props.on_click(task.id)}
                            className="task_text"
                        >
                            {task.text}
                        </span>
                    </li>
                );
            })}
        </ul>
    );
    return (
        <div className={'TasksDisplayer' + done_style}>
            <h4>{title}</h4>
            {body}
        </div>
    );
}

function Participants(contacts) {
    if (contacts.includes(null)) {
        console.log('found null contact');
    }
    const icons = contacts.map((contact) => (
        <div>
            <p className="contact_initials">
                {contact ? contact.get_initials() : ''}
            </p>
            <img src={contact.image_link} />
        </div>
    ));

    return (
        <div className="Container">
            <h5>People in Conversation</h5>
            <div className="ParticipantsIcons">{icons}</div>
        </div>
    );
}
