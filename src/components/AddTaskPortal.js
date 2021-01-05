import React, { useState } from 'react';
import ReactDOM from 'react-dom'
import { PriorityOptions } from './EmailComposer.js';
import { useSelector } from 'react-redux';
import './styles/AddTaskPortal.css';
import { IMPORTANT, PRIORITIES } from '../data_objects/Consts.js';

export function AddTaskPortal(props) {
    const user = useSelector(state => state.user);
    const [date, setDate] = useState(new Date());
    const [task_text, setText] = useState("");
    const [priority, setPriority] = useState(IMPORTANT);
    const add_task_portal = (
        <div className='AddTaskPortal' style={props.style}>
            <TaskContent user={user} setText={setText} />
            <FooterButtons handle_close={props.handle_close} handle_ok={props.handle_ok}
                priority={priority} task_text={task_text} date={date}
                setPriority={setPriority} setDate={setDate} />
        </div>);

    return ReactDOM.createPortal(
        add_task_portal,
        document.getElementById('email_composer')
    );
}


function TaskContent(props) {
    return (
        <div className='TaskContent'>
            <input type='text' placeholder='Task content...' onChange={(e) => props.setText(e.target.value)}></input>
            <img src={props.user.get_icon()}></img>
        </div>
    );
}

function FooterButtons(props) {
    return (
        <div className='FooterButtons'>
            <button className="create_task" onClick={(e) => props.handle_ok(props.task_text, props.date, props.priority)}>Create Task</button>
            <PriorityOptions default_selection={IMPORTANT} onChange={(value) => props.setPriority(PRIORITIES.indexOf(value))} />
            <input type='date' onChange={(e) => props.setDate(e.target.value)}></input>
            <button className="delete" onClick={() => props.handle_close()}>&times;</button>
        </div>
    );
}



