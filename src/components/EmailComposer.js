import React, { Fragment, useState, useEffect } from 'react';
import ReactDOM from 'react-dom'
import ReactQuillWrapper from './external/ReactQuillWrapper.js';
import { EmailChips } from './external/EmailChips.js';
import './EmailComposer.css';
import { create_based_draft, send_email, update_and_send, update_draft } from '../backend/Connect.js';
import { sleep } from '../utils.js';
import { build_email_from_composer, get_recipient_addresses_from_email } from './email_compuser_utils.js';
import Draggable from 'react-draggable';
import { useSelector, useDispatch } from 'react-redux';
import { Delete } from '../actions/email_composer.js'
import { IMPORTANT } from '../data_objects/Consts.js';
import { Email } from '../data_objects/Email.js';
import PriorityOptions from './PriorityOptions.js'

var SEND_WAS_CANCELED = { value: false }

export function EmailComposers() {

    const composers_state = useSelector(state => state.email_composers);
    const user_address = useSelector(state => state.user.get_address());
    const dispatch = useDispatch();
    const [focused, set_focus] = useState(-1);
    const [send_was_canceled, set_send_cancelation] = useState(false);
    const [show_send_message, set_show_send_message] = useState(false);
    const handle_close = (id) => {
        dispatch(Delete(id));
    };

    const my_set_send_cancelation = (value) => {
        SEND_WAS_CANCELED.value = value;
        set_send_cancelation(value);
    }

    const my_send = async (...args) => {
        set_show_send_message(true)
        await sleep(2500)
        const should_send = !SEND_WAS_CANCELED.value
        if (should_send) {
            send(...args);
        }
        set_show_send_message(false);
        my_set_send_cancelation(false);
        return should_send;
    }

    const composers = composers_state.ids.map(n => (
        <div className={focused === n ? "on_top" : undefined} onClick={e => set_focus(n)}>
            <EmailComposer user_address={user_address}
                on_close={() => handle_close(composers_state.ids.indexOf(n))}
                id={composers_state.ids.indexOf(n)}
                send={my_send}
                email_attributes={composers_state.attributes[n]}
            />
        </div>
    ));
    return ReactDOM.createPortal(
        <Fragment>
            <EmailSendMessage
                visible={show_send_message}
                on_undo={() => my_set_send_cancelation(true)}
                was_canceled={send_was_canceled}
            />
            {composers}
        </Fragment>,
        document.getElementById('email_composer')
    );
}
export function EmailComposer(props) {
    const [dest_id, set_dest_id] = useState(undefined);
    const [to, set_to] = useState([]);
    const [cc, set_cc] = useState([]);
    const [bcc, set_bcc] = useState([]);
    const [subject, set_subject] = useState("");
    const [files, set_files] = useState([]);
    const [file_buffers, set_buffers] = useState({});
    const [file_progress, set_progress] = useState({});
    useEffect(() => process_attributes(), []);
    const handle_close = (email_was_sent) => {
        if (props.on_close) {
            props.on_close();
        }
        process_cleanup_attributes(email_was_sent, props.id);

    }
    const handle_send = (html) => {
        props.send(to, subject, html, cc, bcc, file_buffers, files, dest_id).then(res => {
            if (res) {
                handle_close(true);
            }
        });
    };

    function my_set_progress(file, progress) {
        set_progress(old_progresses => {
            var new_progresses = Object.assign({}, old_progresses);
            new_progresses[file.name] = Math.round(progress * 100);
            return new_progresses
        });
    }
    function my_set_buffers(file, new_buffer) {
        set_buffers(old_buffers => {
            var new_buffers = old_buffers;
            new_buffers[file.name] = new_buffer;
            return new_buffers;
        });
    }
    function remove_file(file) {
        set_files(Object.values(files).filter(f => f !== file))
        my_set_buffers(file, undefined)
        my_set_progress(file, undefined)

    }
    async function process_attributes() {
        const attributes = props.email_attributes;
        if (!attributes) {
            return;
        }
        try {
            if (['reply', 'reply_all', 'forward'].includes(attributes.composer_type)) {
                const message = await create_based_draft(attributes.email_id, attributes.composer_type);
                var email_object = new Email(message);
                const recipients = get_recipient_addresses_from_email(email_object)
                const subject = email_object.get_subject();
                set_to(recipients.to);
                set_cc(recipients.cc);
                set_bcc(recipients.bcc);
                set_subject(subject);
                set_dest_id(email_object.get_id());
            }
        } catch (e) {
            console.log(e);
        }
        if (attributes.composer_type === 'quick_reply') {
            set_dest_id(attributes.email_id);
        }
    }

    async function process_cleanup_attributes(email_was_sent, composer_id) {
        const attributes = props.email_attributes;
        if (!attributes) {
            return;
        }
        try {
            if (!email_was_sent) {
                const html_content = get_html_from_composer(composer_id);
                console.log("composer exited and email wasn't sent");
                if (need_to_save_draft(to, subject, html_content, cc, bcc)) {
                    const current_composer_email = build_email_from_composer(to, subject, html_content, cc, bcc, file_buffers, files);
                    console.log("saving draft");
                    await update_draft(dest_id, current_composer_email);
                } else {
                    console.log("no need to save draft")
                }
            }
            // deleaged cleanup function
            if (attributes.cleanup) {
                attributes.cleanup();
            }
        } catch (e) {
            console.log(e);
        }
    }
    const email_content =
        <EmailContent id={props.id} handle_send={handle_send}
            files={files}
            file_progress={file_progress}
            set_files={(e) => my_set_files(e, set_files, my_set_buffers, my_set_progress, props.id)}
            remove_file={remove_file}
            title={props.content_title}
        />
    if (props.only_content) {
        return (
            <div className='EmailComposer'>
                {email_content}
            </div>
        );
    } else {
        return (
            <Draggable handle=".EmailComposer" cancel=".EmailContent" defaultPosition={{ x: 50 * props.id, y: 0 }}>
                <div className='EmailComposer'>
                    <ComposeHeader on_close={(e) => handle_close(false)} user_address={props.user_address} />
                    <Recipients id={props.id} label='To' items={to} onChange={set_to}></Recipients>
                    <Recipients id={props.id} label='CC' items={cc} onChange={set_cc}></Recipients>
                    <Recipients id={props.id} label='BCC' items={bcc} onChange={set_bcc}></Recipients>
                    <Subject value={subject} onChange={(e) => set_subject(e.target.value)}></Subject>
                    {email_content}
                </div>
            </Draggable>
        );
    }
}



function Recipients(props) {
    return (
        <div className='Recipients'>
            <label for={props.label}>{props.label}</label>
            <div className="input_container">
                <EmailChips
                    recipient_id={props.label}
                    composer_id={props.id}
                    type='text' placeholder=''
                    on_items_change={props.onChange}
                    items={props.items} />
            </div>
        </div>
    );
}

function Subject(props) {
    return (
        <div className='Subject'>
            <div className="subject_title_line">
                <h3>Subject</h3>
                {<PriorityOptions default_selection={IMPORTANT} />}
            </div>
            <input type='text' value={props.value} placeholder='' onChange={props.onChange}></input>
        </div>
    );
}


export function EmailContent(props) {
    return (
        <div id={"EmailContent" + props.id} className='EmailContent'>
            <h3 className="content_title">{props.title ? props.title : "Content"}</h3>
            <ReactQuillWrapper id={props.id}
                files={props.files}
                file_progress={props.file_progress}
                set_files={props.set_files}
                remove_file={props.remove_file}
                handle_send={props.handle_send} />
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
            <span id="sender_address">{props.user_address}</span>
            <button className="delete" onClick={props.on_close}>&times;</button>
        </div>

    );
}

function send(to, subject, html_content, cc, bcc, file_buffers, files, existing_id) {
    try {
        const email = build_email_from_composer(to, subject, html_content, cc, bcc, file_buffers, files);
        if (existing_id) {
            update_and_send(existing_id, email)
        } else {
            send_email(email);
        }

    } catch (err) {
        alert(err);
    }
}

export function my_set_files(e, set_files, my_set_buffers, my_set_progress, id) {
    const new_files = [...e.target.files]
    set_files((old_files) => [...old_files, ...new_files.filter(f => !old_files.map(of => of.name).includes(f.name))]);
    upload_files(new_files, my_set_buffers, my_set_progress);
    scroll_to_files(id);
    document.getElementById(e.target.id).value = null;
}

function scroll_to_files(id) {
    const simplebar = document.querySelector('#EmailContent' + id + ' .simplebar-content-wrapper')
    simplebar.scrollBy({ top: 999, left: 0, behavior: 'smooth' });
}
function upload_files(files, my_set_buffers, my_set_progress) {

    for (const file of files) {
        var reader = new FileReader()
        reader.onload = (evt) => {
            my_set_buffers(file, evt.target.result);
            my_set_progress(file, 1);
        }
        reader.onprogress = (evt) => {
            if (evt.loaded && evt.total) {
                my_set_progress(file, evt.loaded / evt.total);
            }
        }
        reader.readAsBinaryString(file);
    }
}

function get_html_from_composer(id) {
    const editor = document.querySelector("#EmailContent" + id + " .ql-editor");
    return editor ? editor.innerHTML : ""
}

export function EmailSendMessage(props) {
    const prompt = props.was_canceled ? "Canceled |" : " Sending email |"
    const style = props.visible ? " visible" : "";
    return (
        <div className={"email_sent_message" + style}>
            <span className="email_sent_label">{prompt}</span>
            <span className="email_sent_undo" onClick={props.on_undo}>Undo</span>
        </div>
    );
}

function need_to_save_draft(to, subject, html_content, cc, bcc) {
    for (const r of [to, cc, bcc]) {
        if (r.length > 0) {
            return true;
        }
    }
    // 11 is the length of an empty message
    return subject || html_content.length > 11
}
