import React, { useState } from 'react';
import './CenterDivision.css';
import SimpleBar from 'simplebar-react';
import { useDispatch, connect } from 'react-redux';
import { Create } from '../../actions/email_composer.js';
import EmailContainer from './EmailContainer.js';
import { Update } from '../../actions/tasks';
import { build_email_action_button } from '../misc/email_composer_utils';
import { act } from '@testing-library/react';

export class CenterDivision extends React.Component {
    render() {
        if (!this.props.thread) {
            return null;
        }
        let thread_emails = this.props.emails.sort(
            (a, b) => a.get_date() - b.get_date()
        );
        if (thread_emails.length == 0) {
            return null;
        }
        let style = 'CenterDivision';
        if (this.props.collapsed_right) {
            style += ' collapsed_right';
        }
        const emails = thread_emails.map((email) => (
            <EmailContainer
                key={email.get_id()}
                email={email}
                thread={this.props.thread}
            />
        ));
        return (
            <div className={style}>
                <SimpleBar className="CenterSimpleBar">{emails}</SimpleBar>
                <NewReply
                    email_id={thread_emails[thread_emails.length - 1].get_id()}
                />
                <ExpandButton
                    is_shrink={this.props.collapsed_right}
                    on_click={this.props.toggle_collapse}
                ></ExpandButton>
            </div>
        );
    }
}

function ExpandButton(props) {
    const symbol = props.is_shrink ? ' < ' : ' > ';
    return (
        <div className="ExpandButton" onClick={props.on_click}>
            {' '}
            {symbol}{' '}
        </div>
    );
}

function NewReply(props) {
    const dispatch = useDispatch();
    const [is_open, set_is_open] = useState(false);
    const cleanup = () => set_is_open(false);
    if (is_open) {
        return null;
    }
    const email_action_buttons = ['reply', 'reply_all', 'forward'].map(
        (type) => {
            const action_button = build_email_action_button(
                dispatch,
                type,
                props.email_id,
                cleanup
            );
            return (
                <button
                    className="email_action_button"
                    onClick={() => {
                        set_is_open(true);
                        action_button.action();
                    }}
                >
                    {action_button.name}
                </button>
            );
        }
    );
    return <div className="ReplyForm">{email_action_buttons}</div>;
}

const mapStateToProps = (state) => ({
    tasks: Object.values(state.tasks),
});

const mapDispatchToProps = {
    Update,
};

export default connect(mapStateToProps, mapDispatchToProps)(CenterDivision);
