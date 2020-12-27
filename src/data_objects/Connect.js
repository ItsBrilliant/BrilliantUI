import Axios from 'axios';
import { sleep } from '../utils.js';
import { Email } from './Email.js';
Axios.defaults.xsrfCookieName = 'csrftoken';
Axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
var REDIRECTED = false
export async function get_mailbox(callback_func, url) {
    while (true) {
        try {
            var res = await Axios.get(url);
            console.log(res)
            const emails = res.data.emails;
            callback_func(emails.map(e => new Email(e)));
            if (res.data.done) {
                break;
            }
        }
        catch (error) {
            console.log('unable to load emails');
            console.log(error);
            return;
        }
    }
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