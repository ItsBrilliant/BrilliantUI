import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useThreadsFromEmails } from '../../hooks/redux';
import { SelectThread } from '../../actions/email_threads';
import FeedComponent, { ButtonsRow } from './FeedComponent';
import EmailThread from '../mail/EmailThread';
import { EmailPostStyle } from './Feed.style';
import { LineIcon, ChevronIcon } from '../misc/svg_icons';

const EXPANDED_LIMIT = 7;
const DEFAULT_LIMIT = 3;
export const DAYS_RECENT = 7;
export default function EmailPost(props) {
    const [expanded, set_expanded] = useState(false);
    const toggle_expansion = () => {
        set_expanded(!expanded);
    };
    let threads = useThreadsFromEmails(props.emails);
    if (threads.length === 0) {
        return null;
    }
    const my_handle_select = (id) => {
        alert('selected: ' + id);
        // dispatch(SelectThread(id));
        // history.push('mail');
    };
    const needs_expansion = threads.length > DEFAULT_LIMIT;
    const limit = expanded ? EXPANDED_LIMIT : DEFAULT_LIMIT;
    let emails = props.emails;
    threads = threads.slice(0, limit);
    let thread_emails = [];
    for (let i = 0; i < threads.length; i++) {
        thread_emails.push([threads[i], emails[i]]);
    }

    const thread_components = thread_emails.map(([thread, email]) => (
        <EmailThread
            key={thread.id}
            id={thread.id}
            thread={thread}
            is_selected={false}
            display_email={email}
            handle_select={my_handle_select}
            priority={props.priority}
            options_offset={{ top: 0, left: 15 }}
        />
    ));
    return (
        <EmailPostStyle>
            <FeedComponent>
                {thread_components}
                {needs_expansion ? (
                    <ViewAll
                        toggle_expansion={toggle_expansion}
                        expanded={expanded}
                    />
                ) : null}
            </FeedComponent>
            <ButtonsRow buttons={props.buttons} />
        </EmailPostStyle>
    );
}

function ViewAll(props) {
    const text = props.expanded ? 'Hide' : 'View all';
    const chevron_style = 'chevron' + (props.expanded ? ' expanded' : '');
    return (
        <div className="ViewAll">
            <LineIcon />
            <button onClick={props.toggle_expansion}>{text}</button>
            <span className={chevron_style}>
                <ChevronIcon />
            </span>
            <LineIcon />
        </div>
    );
}

export function sort_priority_time(a, b) {
    const priority_diff = a.get_priority() - b.get_priority();
    return priority_diff !== 0 ? priority_diff : b.get_date() - a.get_date();
}
