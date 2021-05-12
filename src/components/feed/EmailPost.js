import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useThreadsFromEmails } from '../../hooks/redux';
import { SelectThread } from '../../actions/email_threads';
import FeedComponent, { ButtonsRow } from './FeedComponent';
import EmailThread from '../mail/EmailThread';
import { EmailPostStyle } from './Feed.style';
import { LineIcon, ChevronIcon } from '../misc/svg_icons';
import FeedPost from './FeedPost';

export const DAYS_RECENT = 7;
export default function EmailPost(props) {
    let threads = useThreadsFromEmails(props.emails);
    if (threads.length === 0) {
        return null;
    }
    const my_handle_select = (id) => {
        //  alert('selected: ' + id);
        // dispatch(SelectThread(id));
        // history.push('mail');
    };

    let emails = props.emails;
    let thread_emails = [];
    for (let i = 0; i < threads.length; i++) {
        thread_emails.push([threads[i], emails[i]]);
    }
    const map_func = (items) =>
        items.map(([thread, email]) => (
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
    const buttons = ['Quick Reply All', 'Book Time'].map((b) => {
        return { name: b, action: () => {} };
    });
    return (
        <FeedPost
            items={thread_emails}
            map_to_components={map_func}
            default_limit={3}
            expanded_limit={7}
            buttons={buttons}
            type="emails"
        />
    );
}

export function sort_priority_time(a, b) {
    const priority_diff = a.get_priority() - b.get_priority();
    return priority_diff !== 0 ? priority_diff : b.get_date() - a.get_date();
}
