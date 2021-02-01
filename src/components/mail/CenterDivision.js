import React, { useState } from 'react';
import { attachmentIcon } from './EmailThread.js';
import './CenterDivision.css';
import SimpleBar from 'simplebar-react';
import { download_attachment } from '../../backend/Connect.js';
import { useSelector, useDispatch } from 'react-redux'
import { Create } from '../../actions/email_composer.js';
import EmailContainer from './EmailContainer.js';

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
        const thread_emails = this.props.thread.get_emails()
            .reverse() // Drafts are shown only in Draft folder and vice versa
            .filter(e => e.is_draft() === (this.props.selected_folder === 'Drafts'));
        if (thread_emails.length == 0) {
            return null;
        }
        const options_button = {
            selected_value: this.state.selected_value,
            onChange: this.handle_option_button_click,
        }
        const emails = thread_emails.map((email) =>
            <EmailContainer
                key={email.get_id()}
                email={email}
                options_button={options_button}
                selected_task={this.props.selected_task}
            />);
        return (
            <div className='CenterDivision' >
                <SimpleBar className="CenterSimpleBar">
                    {emails}
                </SimpleBar>
                <NewReply email_id={thread_emails[thread_emails.length - 1].get_id()} />
            </div>
        );
    }
}



function NewReply(props) {
    const dispatch = useDispatch();
    const [is_open, set_is_open] = useState(false);
    if (is_open) {
        return null;
    }
    return (
        <div className="ReplyForm">
            <span
                className="reply_button"
                onClick={() => {
                    set_is_open(true);
                    dispatch(Create({
                        email_id: props.email_id,
                        cleanup: () => set_is_open(false),
                        composer_type: 'reply'
                    }));
                }}
            >Reply</span>
        </div>
    );
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

// attachments per email, Not in uses
function AttachedFile(props) {
    const user = useSelector(state => state.user);
    const attachment = props.attachment
    return (
        <div className='AttachedFile'
            onClick={() => download_attachment(attachment.email_id, attachment.id, user)}>
            {attachmentIcon()}

            <p>{attachment.name} <span class="tooltiptext">download</span></p>
        </div>
    );
}

function AttachedFiles(attachments) {
    if (attachments === undefined || attachments.length == 0) {
        return null;
    } else {
        var attached_files = attachments.map((attachment) => <AttachedFile attachment={attachment} />);
        return (
            <div className="AttachedFiles">
                {attached_files}
            </div>
        );
    }
}
