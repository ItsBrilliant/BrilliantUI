import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SelectThread } from '../../actions/email_threads';
import FeedComponent, { ButtonsRow } from './FeedComponent';
import EmailThread from '../mail/EmailThread';
import { EmailPostStyle } from './Feed.style';

export default function EmailPost(props) {
    const dispatch = useDispatch();
    const history = useHistory();
    let threads = props.threads;
    if (props.threads.length === 0) {
        return null;
    }
    const count = props.max_threads ? props.max_threads : 3;
    threads = threads.slice(0, count);
    const my_handle_select = (id) => {
        dispatch(SelectThread(id));
        history.push('mail');
    };
    const thread_components = threads.map((thread) => (
        <EmailThread
            key={thread.id}
            id={thread.id}
            thread={thread}
            is_selected={false}
            handle_select={my_handle_select}
            priority={props.priority}
            options_offset={{ top: 0, left: 15 }}
        />
    ));
    return (
        <EmailPostStyle>
            <div className="threads">{thread_components}</div>
            <ButtonsRow buttons={props.buttons} />
        </EmailPostStyle>
    );
}
