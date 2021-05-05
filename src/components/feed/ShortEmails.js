import React from 'react';
import { useEmailsHead } from '../../hooks/redux';
import EmailPost, { sort_priority_time } from './EmailPost';
import { is_incoming_email, is_in_last_x_days } from './utils';

const MAX_CHARACTERS = 130;
export default function ShortEmails(props) {
    let emails = useEmailsHead();
    emails = emails
        .filter((e) => short_email_filter(e, MAX_CHARACTERS, 7))
        .sort(sort_priority_time);
    if (emails.length === 0) {
        return null;
    }
    const buttons = ['Quick Reply All', 'Book Time'].map((b) => {
        return { name: b, action: () => {} };
    });
    return <EmailPost emails={emails} buttons={buttons} />;
}

function short_email_filter(email, max_characters, days_passed) {
    if (!is_incoming_email(email) || !is_in_last_x_days(email, days_passed)) {
        return false;
    }
    const text = email.get_text();
    return text.length <= max_characters;
}
