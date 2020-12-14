import Axios from 'axios';
import { Email } from './Email.js';
Axios.defaults.xsrfCookieName = 'csrftoken';
Axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

export function get_mailbox(callback_func) {
    Axios.get('/inbox_react').then(res => {
        const emails = res.data;
        callback_func(emails.map(e => new Email(e)));
    })
}

export function send_email(email) {
    Axios.post('/sendmail_react', email).then(res => console.log(res));
}