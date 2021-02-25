import React, { Fragment, useState, useEffect } from 'react';
import ReactDOM from 'react-dom'
import PriorityOptions from './PriorityOptions.js';
import { useSelector } from 'react-redux';
import './styles/AddTaskPortal.css';
import { IMPORTANT, PRIORITIES } from '../data_objects/Consts.js';
import { Contact } from '../data_objects/Contact.js';

const DEFAULT_TASK_TEXT = "Manual Task";

export function AddTaskPortal(props) {
    const user = useSelector(state => state.user);
    const [date, setDate] = useState(props.date || new Date());
    const [task_text, setText] = useState(props.task_text || DEFAULT_TASK_TEXT);
    const [priority, setPriority] = useState(props.priority);
    const [owner, setOwner] = useState(user);
    const add_task_portal = (
        <>
            <div className="invisible_portal_wrapper" onClick={props.handle_close} />
            <div className='AddTaskPortal' style={props.style}>
                <TaskContent setText={setText} owner={owner} setOwner={setOwner} task_text={task_text} />
                <FooterButtons handle_close={props.handle_close} handle_ok={props.handle_ok}
                    priority={priority} task_text={task_text} date={date}
                    setPriority={setPriority} setDate={setDate} owner={owner} />
            </div>
        </>);

    return ReactDOM.createPortal(
        add_task_portal,
        document.getElementById('email_composer')
    );
}


function TaskContent(props) {
    useEffect(() => {
        let task_text_element = document.querySelector('.TaskContent #task_text_input');
        task_text_element.focus();
    }, [])
    const [edited_owner_value, set_owner_value] = useState(props.owner.get_address());
    const owner_options = Contact.get_filtered_contacts(edited_owner_value);
    const owner_selection_list = owner_options[0] === edited_owner_value ? null :
        <ul className="owner_selection_list">
            {owner_options.map(o => <li onClick={(e) => {
                props.setOwner(Contact.create_contact_from_address(e.target.innerText));
                set_owner_value(e.target.innerText);
            }}
                value={o}>{o}</li>)}
        </ul>
    return (
        <div>
            <div className='task_owner'>
                <img src={props.owner.get_icon()}></img>
                <input type='text' value={edited_owner_value} onChange={(e) => set_owner_value(e.target.value)}></input>
                {owner_selection_list}
            </div>
            <div className='TaskContent'>
                <input id="task_text_input" type='text' value={props.task_text} placeholder='Task content...' onChange={(e) => props.setText(e.target.value)}></input>
            </div>
        </div>
    );
}

function FooterButtons(props) {
    return (
        <div className='FooterButtons'>
            <button className="create_task"
                onClick={(e) => props.handle_ok(props.task_text, new Date(props.date), props.priority, props.owner)}>Create Task</button>
            <PriorityOptions default_selection={props.priority} onChange={(value) => props.setPriority(PRIORITIES.indexOf(value))} />
            <input type='date' onChange={(e) => props.setDate(e.target.value)}></input>
            <button className="delete" onClick={() => props.handle_close()}>&times;</button>
        </div>
    );
}



