import React from 'react';
import { EmailTextArea, EmailStamp, attachmentIcon } from './EmailThread.js';
import './CenterDivision.css';
import SimpleBar from 'simplebar-react';
import { AddTaskModal } from './AddTaskModal.js';
import { EmailReplyModal } from './EmailReplyModal.js';
import { GroupIcon } from './EmailThread.js'

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
            this.props.thread.get_email(email_id).isUnread = false;
            this.reset();
        } else {
            this.setState({ show_add_task: true, selected_value: e.value, email_id: email_id });
        }
    }
    render() {
        const options_button = {
            selected_value: this.state.selected_value,
            onChange: this.handle_option_button_click,
        }
        const modal = this.state.selected_value == 'Add Task' ?
            <AddTaskModal show={this.state.show_add_task} handle_ok={this.add_task}
                close={this.reset} /> :
            <EmailReplyModal show={this.state.show_add_task} handle_ok={this.reset}
                close={this.reset} />
        const emails = this.props.thread.emails.map(
            (email) => <EmailContainer key={email.id} email={email} options_button={options_button} />).reverse();
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
        const contatcs = email.receivers.map(receiver => receiver.image_link)
        return (
            <div className='EmailContainer'>
                {EmailStamp([email.sender.image_link], email.date, email.sender.first_name)}
                <EmailTextArea isUnread={email.isUnread} content={email.content} overflow={true}
                    options_button={this.props.options_button} tags={email.tags} id={email.id} />
                <div className="mail_right_info">
                    {GroupIcon(contatcs)}
                    {AttachedFiles(email.attachments)}
                </div>
            </div>
        );
    }
}

function AttachedFile(attachment) {
    return (
        <div className='AttachedFile'>
            {attachmentIcon()}
            <p>{attachment}</p>
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