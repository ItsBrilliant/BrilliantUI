import React, { useState } from 'react';
import ReactDOM, { unstable_renderSubtreeIntoContainer } from 'react-dom'
import { PriorityOptions } from './EmailComposer.js';
import { useSelector } from 'react-redux';
import './styles/AddTaskPortal.css';
import { IMPORTANT, PRIORITIES } from '../data_objects/Consts.js';
import { Contact } from '../data_objects/Contact.js';

export function AddTaskPortal(props) {
    const user = useSelector(state => state.user);
    const [date, setDate] = useState(new Date());
    const [task_text, setText] = useState("");
    const [priority, setPriority] = useState(IMPORTANT);
    const [owner, setOwner] = useState(user);
    const add_task_portal = (
        <div className='AddTaskPortal' style={props.style}>
            <TaskContent setText={setText} owner={owner} setOwner={setOwner} />
            <FooterButtons handle_close={props.handle_close} handle_ok={props.handle_ok}
                priority={priority} task_text={task_text} date={date}
                setPriority={setPriority} setDate={setDate} owner={owner} />
        </div>);

    return ReactDOM.createPortal(
        add_task_portal,
        document.getElementById('email_composer')
    );
}


function TaskContent(props) {
    const [edited_owner_value, set_owner_value] = useState(props.owner.get_address());
    const owner_options = Contact.get_filtered_contacts(edited_owner_value);
    const owner_selection_list = owner_options[0] == edited_owner_value ? null :
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
                <input type='text' placeholder='Task content...' onChange={(e) => props.setText(e.target.value)}></input>
            </div>
        </div>
    );
}

function FooterButtons(props) {
    return (
        <div className='FooterButtons'>
            <button className="create_task"
                onClick={(e) => props.handle_ok(props.task_text, props.date, props.priority, props.owner)}>Create Task</button>
            <PriorityOptions default_selection={IMPORTANT} onChange={(value) => props.setPriority(PRIORITIES.indexOf(value))} />
            <input type='date' onChange={(e) => props.setDate(e.target.value)}></input>
            <button className="delete" onClick={() => props.handle_close()}>&times;</button>
        </div>
    );
}



