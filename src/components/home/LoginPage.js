import React from 'react';
import { useHistory } from 'react-router-dom';

import './LoginPage.css';

export function LoginPage(props) {
    let history = useHistory();
    const handle_click = (is_login) => {
        if (is_login) {
            history.push('/external_login');
        } else {
            history.push('external_logout');
        }
    };
    const header = props.user_address ? 'Logged in as:' : 'Please Login';
    const email_labels = props.user_address ? (
        <label id="user_email">{props.user_address}</label>
    ) : null;
    const action_button = props.user_address ? (
        <button className="out" onClick={() => handle_click(false)}>
            Log out
        </button>
    ) : (
        <button className="in" onClick={() => handle_click(true)}>
            Log in
        </button>
    );
    const comment_style = { color: 'gray', margin: '10px' };
    return (
        <div>
            <div className="LoginPage">
                <h3>{header}</h3>
                {email_labels}
                <div className="login_page_buttons">{action_button}</div>
            </div>
            <p style={comment_style}>Updated April 22nd</p>
            <p style={comment_style}>
                -Search result priorities are shown on the right
            </p>
            <p style={comment_style}>-Task followers can be removed</p>
            <p style={comment_style}>
                -Tasks are sorted by clicking on the header of the column you
                want to sort by
            </p>
            <p style={comment_style}>
                -Task multiselect button on the left of task row is shown only
                on hover
            </p>
            <p style={comment_style}>
                -Search for emails, tasks, events, files and contacts via the
                search bar with a built-in filter
            </p>
            <p style={comment_style}>
                -Global filter implemented for contacts, tags, and priority
            </p>
            <p style={comment_style}>
                -Change owner of a task from the task view page
            </p>
            <p style={comment_style}>
                -Task conversations are stored in the database
            </p>
            <p style={comment_style}>
                -"Reply to short emails" component in the feed is located at the
                user's preffered email sending time
            </p>
        </div>
    );
}
