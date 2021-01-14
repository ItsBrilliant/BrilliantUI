import React from 'react';
import { EmailTextArea, EmailStamp, attachmentIcon } from './EmailThread.js';
import './CenterDivision.css';
import SimpleBar from 'simplebar-react';
import { AddTaskModal } from '../external/AddTaskModal.js';
import { EmailReplyModal } from '../external/EmailReplyModal.js';
import { GroupIcon } from './EmailThread.js'
import { SHOW_HTML } from '../Home.js'

export class CenterDivision extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show_add_task: false,
            selected_value: null
        };
        this.handle_option_button_click = this.handle_option_button_click.bind(this);
        this.add_task = this.add_task.bind(this);
        this.reset = this.reset.bind(this);
    }
    reset() {
        this.setState({
            show_add_task: false,
            selected_value: null,
            email_id: null
        });
    }
    add_task(task) {
        this.setState({ show_add_task: false, selected_value: null });
        this.props.thread.get_email(this.state.email_id).add_task(task)
    }
    handle_option_button_click(e, email_id) {
        if (e.value === 'Delete') {
            this.props.thread.delete_email(email_id);
            this.reset()
        }
        else if (e.value === 'Mark Read') {
            this.props.thread.get_email(email_id).set_is_read(true);
            this.reset();
        } else {
            this.setState({ show_add_task: true, selected_value: e.value, email_id: email_id });
        }
    }
    render() {
        if (!this.props.thread) { return null; }
        const options_button = {
            selected_value: this.state.selected_value,
            onChange: this.handle_option_button_click,
        }
        const modal = this.state.selected_value == 'Add Task' ?
            <AddTaskModal show={this.state.show_add_task} handle_ok={this.add_task}
                close={this.reset} /> :
            <EmailReplyModal show={this.state.show_add_task} handle_ok={this.reset}
                close={this.reset} />
        const emails = this.props.thread.get_emails().map(
            (email) => <EmailContainer key={email.get_id()} email={email} options_button={options_button}
                selected_task={this.props.selected_task} />).reverse();
        return (
            <div className='CenterDivision' >
                <SimpleBar className="CenterSimpleBar">
                    <div>{emails}</div>
                </SimpleBar>
                <ReplyForm />
                {modal}
            </div>
        );
    }
}

class EmailContainer extends React.Component {
    render() {

        const email = this.props.email;
        const contacts = email.get_receivers().map(receiver => receiver.image_link)
        const sender = email.get_sender()
        const is_html = SHOW_HTML && email.get_content_type() === 'html'
        const content = is_html ? email.get_html() : email.get_text();
        const stamp = sender ? EmailStamp([sender.image_link], email.date, sender.get_name()) : null
        return (
            <div className='EmailContainer'>
                {stamp}
                <EmailTextArea isUnread={!email.get_is_read()}
                    sender_name={sender ? sender.get_name() : null}
                    content={content}
                    is_html={is_html}
                    subject={email.get_subject()}
                    of_center_email={true}
                    options_button={this.props.options_button}
                    tags={email.get_tags()} id={email.get_id()}
                    tasks={email.get_tasks()}
                    selected_task={this.props.selected_task}
                    add_task={email.add_task.bind(email)}
                    contacts={contacts} />
                <div className="mail_right_info">
                    {AttachedFiles(email.get_attachments())}
                </div>
            </div>
        );
    }
}

function AttachedFile(attachment) {
    return (
        <div className='AttachedFile' onClick={() => alert(attachment.id)}>
            {attachmentIcon()}
            <p>{attachment.name}</p>
        </div>
    );
}

function AttachedFiles(attachments) {
    if (attachments === undefined || attachments.length == 0) {
        return null;
    } else {
        var attached_files = attachments.map((attachment) => AttachedFile(attachment));
        return (
            <div className="AttachedFiles">
                {attached_files}
            </div>
        );
    }
}

class ReplyForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            touched: false
        }
    }
    submitmyeventHandler = (myevent) => {
        alert("Reply sent");
        this.setState({
            text: ''
        });
    }
    changeEventHandler = (myevent) => {
        this.setState({ text: myevent.target.value });
    }
    render() {
        return (
            <form className="ReplyForm" onSubmit={this.submitmyeventHandler}>
                <input
                    type='text'
                    placeholder='Reply'
                    value={this.state.text}
                    onChange={this.changeEventHandler}
                />
                <img className='file' src='file_icons/attachment.png'></img>
                <input
                    value=''
                    placeholder=''
                    type='file'
                />
                <img className='send' src='button_icons/send.png'></img>
                <input
                    value=''
                    type='button'
                    onClick={this.submitmyeventHandler}

                />
            </form>
        );
    }
}