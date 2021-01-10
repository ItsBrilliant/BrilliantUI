import Axios from 'axios';
import { Email } from '../data_objects/Email.js';
import graph from './graph.js';
import { person0 } from '../data_objects/Contact.js'
Axios.defaults.xsrfCookieName = 'csrftoken';
Axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

var ACCESS_TOKEN;

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

export async function get_all_mail(callback_func) {
    try {
        await get_access_token();
        const emails = await graph.getMail(ACCESS_TOKEN);
        callback_func(emails.map(e => new Email(e)));
    } catch (e) {
        console.log("Error getting email messages:");
        console.log(e);
    }
}

export async function get_calendar(callback_func) {
    try {
        await get_access_token();
        const events = await graph.getEvents(ACCESS_TOKEN);
        callback_func(events);
    } catch (e) {
        console.log("Error getting events:");
        console.log(e);
    }
}

export async function send_email(email) {
    //Axios.post('/sendmail_react', email).then(res => console.log(res));
    console.log("sending email");
    const res = await graph.sendMail(ACCESS_TOKEN, email);
    console.log(res)
}

async function get_access_token() {
    if (!ACCESS_TOKEN) {
        console.log("getting token");
        try {
            const res = await Axios.post('/token/auth/get_token',
                { email_address: person0.get_address() });
            ACCESS_TOKEN = res.data;
            console.log("got token:");
            console.log(res);
        } catch (e) {
            console.log("Error getting token:");
            console.log(e);
        }
    }
}

