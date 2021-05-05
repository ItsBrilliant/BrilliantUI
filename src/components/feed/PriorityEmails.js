import React from 'react';
import EmailPost, { DAYS_RECENT } from './EmailPost';
import { useEmailsHead } from '../../hooks/redux';
import { is_incoming_email, is_in_last_x_days } from './utils';

export default function PriorityEmails(props) {
    let emails = useEmailsHead();
    emails = emails
        .filter((e) => priority_email_filter(e, props.priority, DAYS_RECENT))
        .sort(priority_email_sort);

    const buttons = ['Quick Reply All', 'Book Time'].map((b) => {
        return { name: b, action: () => {} };
    });
    return <EmailPost emails={emails} buttons={buttons} />;
}

function priority_email_filter(email, priority, past_days) {
    return (
        is_incoming_email(email) &&
        email.get_priority() === priority &&
        is_in_last_x_days(email, past_days)
    );
}

function priority_email_sort(a, b) {
    return b.get_date() - a.get_date();
}
