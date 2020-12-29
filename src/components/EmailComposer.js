import React, { useState } from 'react';
import { Menu } from './external/Menues.js';
import ReactQuillWrapper from './external/ReactQuillWrapper.js';
import { EmailChips } from './external/EmailChips.js';
import './EmailComposer.css';
import { send_email } from '../backend/Connect.js';
import { create_mail_object, get_priority_style_by_name } from '../utils.js';
import { person0 } from './mail/Mail.js';
import Draggable from 'react-draggable';
import { attributesToProps } from 'html-react-parser';


export function EmailComposer(props) {
    const [to, set_to] = useState([]);
    const [cc, set_cc] = useState([]);
    const [bcc, set_bcc] = useState([]);
    const [subject, set_subject] = useState("");
    const handle_send = (html) => send(to, subject, html, cc, bcc);
    return (
        <Draggable handle=".EmailComposer" cancel=".EmailContent">
            <div className='EmailComposer'>
                <ComposeHeader on_close={props.on_close} on_send={props.on_send} />
                <Recipients label='To' items={to} onChange={set_to}></Recipients>
                <Recipients label='CC' items={cc} onChange={set_cc}></Recipients>
                <Recipients label='BCC' items={bcc} onChange={set_bcc}></Recipients>
                <Subject onChange={(e) => set_subject(e.target.value)}></Subject>
                <EmailContent handle_send={handle_send}></EmailContent>
            </div>
        </Draggable>
    );
}

function Recipients(props) {
    return (
        <div className='Recipients'>
            <label for={props.label}>{props.label}</label>
            <div className="input_container">
                <EmailChips id={props.label} type='text' placeholder=''
                    on_items_change={props.onChange} items={props.items} />
            </div>
        </div>
    );
}

function Subject(props) {
    const options = ['No Priority', 'Urgent', 'Important', 'Can Wait'];
    const default_selection_index = 0;
    const [selected, set_selected] = useState(options[default_selection_index]);
    const style_class = get_priority_style_by_name(selected);
    return (
        <div className='Subject'>
            <div className="subject_title_line">
                <h3>Subject</h3>
                <Menu value={selected} options={options} style_class={style_class} onChange={(sel) => set_selected(sel.value)}></Menu>
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
    );
}

function ComposeHeader(props) {
    return (
        <div className="header">
            <div className="header_label">
                <img src="button_icons/mail.svg"></img>
                <span id="from_label">From</span>
            </div>
            <span id="sender_address">{person0.get_address()}</span>
            <button id="delete">&times;</button>
        </div>

    );
}

function send(to, subject, html_content, cc, bcc) {
    const email = create_mail_object(to, subject, html_content, 'html', cc, bcc);
    //   console.log(email);
    send_email(email);
}


