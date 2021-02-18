export const ExpandThreads = (emails) => {
    return {
        type: "EXPAND_THREADS",
        emails: emails
    };
}

export const DeleteEmails = (thread_id, email_ids) => {
    if (typeof (email_ids) === 'string') {
        email_ids = [email_ids];
    }
    return {
        type: "DELETE_EMAILS",
        thread_id: thread_id,
        email_ids: email_ids
    };
}

export const DeleteThread = (id) => {
    return {
        type: "DELETE_THREAD",
        id: id
    };
}

export const ResetThreads = () => {
    return {
        type: "RESET_THREADS"
    };
}

