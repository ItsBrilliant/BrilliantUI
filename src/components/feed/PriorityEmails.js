import React from 'react';
import EmailPost from './EmailPost';
import { useThreadsFromEmails, useEmailsHead } from '../../hooks/redux';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { SelectThread } from '../../actions/email_threads';
import { is_incoming_email } from './utils';

export default function PriorityEmails(props) {
    let emails = useEmailsHead();
    emails = emails.filter(
        (e) => is_incoming_email(e) && e.get_priority() === props.priority
    );
    let threads = useThreadsFromEmails(emails);
    const buttons = ['Done', 'Delay', 'Cancel'].map((b) => {
        return { name: b, action: () => {} };
    });
    return <EmailPost threads={threads} emails={emails} buttons={buttons} />;
}
