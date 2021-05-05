import React from 'react';
import { useThreadsFromEmails, useEmailsHead } from '../../hooks/redux';
import EmailPost, { sort_priority_date } from './EmailPost';
import { is_short_incoming_email } from './utils';

export default function ShortEmails(props) {
    let emails = useEmailsHead();
    emails = emails.filter((e) => is_short_incoming_email(e, 130));
    emails = sort_priority_date(emails);
    let threads = useThreadsFromEmails(emails);
    if (emails.length === 0) {
        return null;
    }
    const buttons = ['Reply all', 'Book Time'].map((b) => {
        return { name: b, action: () => {} };
    });
    return <EmailPost threads={threads} emails={emails} buttons={buttons} />;
}
