import React, { Fragment } from 'react';
import EmailTextArea from './EmailTextArea.js';
import { useSelector } from 'react-redux';
import { SHOW_HTML } from '../Home.js';
import { EmailStamp } from './EmailStamp.js';
import "./EmailContainer.css";
export default function EmailContainer(props) {
    const user = useSelector(state => state.user)
    const email = props.email;
    const contacts = email.get_receivers().map(receiver => receiver.image_link)
    var sender = email.get_sender()
    if (!sender) {
        sender = user
    }
    const is_html = SHOW_HTML && email.get_content_type() === 'html'
    const content = is_html ? email.get_html() : email.get_text();
    const stamp = sender ? EmailStamp([sender.image_link], email.date, sender.get_name()) : null
    const email_text_area =
        <EmailTextArea isUnread={!email.get_is_read()}
            sender_name={sender ? sender.get_name() : null}
            content={content}
            is_html={is_html}
            subject={email.get_subject()}
            of_center_email={true}
            options_button={props.options_button}
            tags={email.get_tags()} id={email.get_id()}
            tasks={email.get_tasks()}
            selected_task={props.selected_task}
            add_task={email.add_task.bind(email)}
            contacts={contacts}
            priority={email.get_priority()}
        />
    const result = (sender === user ?
        <Fragment>{email_text_area} {stamp}</Fragment> :
        <Fragment>{stamp} {email_text_area}</Fragment>)
    return (
        <div className='EmailContainer'>
            {result}
        </div>
    );
}
// Used to be to the right of the email_text_area
//   <div className="mail_right_info">
//      {AttachedFiles(email.get_attachments())}
// </div>