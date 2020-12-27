import React from 'react';
import { Menu } from './external/Menues.js';
import ReactQuillWrapper from './external/ReactQuillWrapper.js';
import './EmailComposer.css';

export function EmailComposer() {
    return (
        <div className='EmailComposer'>
            <h1>Email Composer</h1>
            <Recipients label='To'></Recipients>
            <Recipients label='CC'></Recipients>
            <Recipients label='BCC'></Recipients>
            <Subject></Subject>
            <EmailContent></EmailContent>
        </div>
    );
}

function Recipients(props) {
    return (
        <div className='Recipients'>
            <label for={props.label}>{props.label}</label>
            <input id={props.label} type='text' placeholder=''></input>
        </div>
    );
}

function Subject() {
    const options = ['None', 'Urgent', 'Important', 'Can Wait'];
    return (
        <div className='Subject'>
            <div className="subject_title_line">
                <h3>Subject</h3>
                <Menu value={options[0]} options={options}></Menu>
            </div>
            <input type='text' placeholder=''></input>
        </div>
    );
}


export function EmailContent() {
    return (
        <div className='EmailContent'>
            <h3>Content</h3>
            <ReactQuillWrapper />
        </div>
    )
}
