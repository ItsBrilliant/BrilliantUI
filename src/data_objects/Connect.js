import Axios from 'axios';
import { Email } from './Email.js';
Axios.defaults.xsrfCookieName = 'csrftoken';
Axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

export function get_mailbox(callback_func) {
    Axios.get('/inbox_react').then(res => {
        const emails = res.data;
        callback_func(emails.map(e => new Email(e)));
    }).catch((res) => {
        console.log('unable to load emails');
        if (res.response.status === 500) {
            console.log("Server response 500, redirecting to 'signin' page");
            window.open('http://localhost:8000/signin')
        }
    });
}

export function get_calendar(callback_func) {
    Axios.get('/calendar_react').then(res => {
        const events = res.data;
        callback_func(events);
    }).catch((res) => {
        console.log('unable to load events');
    });
}


export function send_email(email) {
    Axios.post('/sendmail_react', email).then(res => console.log(res));
}