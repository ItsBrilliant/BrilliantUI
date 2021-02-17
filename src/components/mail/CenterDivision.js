import React, { useState } from 'react';
import './CenterDivision.css';
import SimpleBar from 'simplebar-react';
import { useDispatch, connect } from 'react-redux'
import { Create } from '../../actions/email_composer.js';
import EmailContainer from './EmailContainer.js';
import { Update } from '../../actions/tasks'
import { Task } from '../../data_objects/Task'


export class CenterDivision extends React.Component {

    filter_emails(emails) {
        return emails.filter(e => {
            const folder_id = e.get_folder_id();
            if (folder_id === this.props.folders['Deleted Items'] ||
                folder_id === this.props.folders['Drafts']) {
                return folder_id === this.props.selected_folder_id;
            }
            return true;

        })
    }
    render() {
        if (!this.props.thread) { return null; }
        const thread_emails = this.filter_emails(this.props.emails);

        if (thread_emails.length == 0) {
            return null;
        }

        const emails = thread_emails.map((email) =>
            <EmailContainer
                key={email.get_id()}
                email={email}
                thread={this.props.thread}
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

const mapStateToProps = state => ({
    tasks: Object.values(state.tasks)
});

const mapDispatchToProps = {
    Update
};

export default connect(mapStateToProps, mapDispatchToProps)(CenterDivision);