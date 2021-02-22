import React, { useState } from 'react';
import './CenterDivision.css';
import SimpleBar from 'simplebar-react';
import { useDispatch, connect } from 'react-redux'
import { Create } from '../../actions/email_composer.js';
import EmailContainer from './EmailContainer.js';
import { Update } from '../../actions/tasks'


export class CenterDivision extends React.Component {

    render() {
        if (!this.props.thread) { return null; }
        let thread_emails = this.props.emails.sort((a, b) => a.get_date() - b.get_date());
        if (thread_emails.length == 0) {
            return null;
        }
        let style = 'CenterDivision';
        if (this.props.collapsed_right) {
            style += ' collapsed_right';
        }
        const emails = thread_emails.map((email) =>
            <EmailContainer
                key={email.get_id()}
                email={email}
                thread={this.props.thread}
            />);
        return (
            <div className={style}>
                <SimpleBar className="CenterSimpleBar">
                    {emails}
                </SimpleBar>
                <NewReply email_id={thread_emails[thread_emails.length - 1].get_id()} />
                <ExpandButton is_shrink={this.props.collapsed_right} on_click={this.props.toggle_collapse}></ExpandButton>
            </div>
        );
    }
}

function ExpandButton(props) {
    const symbol = props.is_shrink ? " < " : " > "
    return (
        <div className="ExpandButton" onClick={props.on_click}> {symbol} </div>
    )
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

const mapStateToProps = state => ({
    tasks: Object.values(state.tasks)
});

const mapDispatchToProps = {
    Update
};

export default connect(mapStateToProps, mapDispatchToProps)(CenterDivision);