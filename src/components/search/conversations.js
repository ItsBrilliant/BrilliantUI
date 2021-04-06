import { SelectThread } from '../../actions/email_threads';
import { format_date } from '../../utils';

export const EMAIL_PROPS = {
    top_line: (email) => email.get_subject(),
    bottom_line: (email) =>
        email.get_sender() ? email.get_sender().get_address() : '',
    icon: 'button_icons/mail.svg',
    time_stamp: (email) => {
        let timestamp = format_date(email.get_date());
        return timestamp.date + ' ' + timestamp.time;
    },
    url: 'mail',
    action: (email) => SelectThread(email.get_thread_id()),
};

export const EMAIL_FILTER_FUNCTION = (email, search_value) =>
    search_value &&
    (email.get_subject().toLowerCase().includes(search_value.toLowerCase()) ||
        (email.get_sender() &&
            email.get_sender().get_address().includes(search_value)));

export const FILE_PROPS = {
    top_line: (email) =>
        email
            .get_attachments()
            .map((a) => a.name)
            .join(' '),
    bottom_line: (email) =>
        (email.get_sender() ? email.get_sender().get_address() + ': ' : '') +
        email.get_subject(),
    icon: 'button_icons/files.svg',
    time_stamp: (email) => {
        let timestamp = format_date(email.get_date());
        return timestamp.date + ' ' + timestamp.time;
    },
    url: 'mail',
    action: (email) => SelectThread(email.get_thread_id()),
};

export const FILE_FILTER_FUNCTION = (email, search_value) =>
    search_value &&
    email
        .get_attachments()
        .map((attacment) =>
            attacment.name.toLowerCase().includes(search_value.toLowerCase())
        )
        .includes(true);
