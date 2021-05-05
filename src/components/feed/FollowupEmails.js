import React from 'react';
import EmailPost, { sort_priority_time } from './EmailPost';
import { useEmailsHead } from '../../hooks/redux';
import { is_in_last_x_days } from './utils';

const EXPECTED_RESPONSE_TIME = 2;
export default function FollowupEmails(props) {
    let emails = useEmailsHead();
    emails = emails
        .filter((e) => followup_email_filter(e, EXPECTED_RESPONSE_TIME))
        .sort(sort_priority_time);

    const buttons = ['Quick Reply All', 'Book Time'].map((b) => {
        return { name: b, action: () => {} };
    });
    return <EmailPost emails={emails} buttons={buttons} />;
}

function followup_email_filter(email, past_days) {
    return email.is_sent() && !is_in_last_x_days(email, past_days);
}
