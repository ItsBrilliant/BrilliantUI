import React, { useState } from 'react';
import { Menu } from './external/Menues.js';
import ReactQuillWrapper from './external/ReactQuillWrapper.js';
import './EmailComposer.css';
import { send_email } from '../backend/Connect.js';
import { create_mail_object } from '../utils.js';

export function EmailComposer() {
    const [to, set_to] = useState("");
    const [cc, set_cc] = useState("");
    const [bcc, set_bcc] = useState("");
    const [subject, set_subject] = useState("");
    const handle_send = (html) => send([to], subject, html, [cc], [bcc]);
    return (
        <div className='EmailComposer'>
            <Recipients label='To' onChange={(e) => set_to(e.target.value)}></Recipients>
            <Recipients label='CC' onChange={(e) => set_cc(e.target.value)}></Recipients>
            <Recipients label='BCC' onChange={(e) => set_bcc(e.target.value)}></Recipients>
            <Subject onChange={(e) => set_subject(e.target.value)}></Subject>
            <EmailContent handle_send={handle_send}></EmailContent>
        </div>
    );
}

function Recipients(props) {
    return (
        <div className='Recipients'>
            <label for={props.label}>{props.label}</label>
            <input id={props.label} type='text' placeholder='' onChange={props.onChange}></input>
        </div>
    );
}

function Subject(props) {
    const options = ['No Priority', 'Urgent', 'Important', 'Can Wait'];
    return (
        <div className='Subject'>
            <div className="subject_title_line">
                <h3>Subject</h3>
                <Menu value={options[0]} options={options}></Menu>
            </div>
            <input type='text' placeholder='' onChange={props.onChange}></input>
        </div>
    );
}


export function EmailContent(props) {
    return (
        <div className='EmailContent'>
            <h3>Content</h3>
            <ReactQuillWrapper handle_send={props.handle_send} />
        </div>
    )
}

function send(to, subject, html_content, cc, bcc) {
    const email = create_mail_object(to, subject, html_content, 'html', cc, bcc);
    console.log(email)
    send_email(email);
}

