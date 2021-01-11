import Axios from 'axios';
import { Email } from '../data_objects/Email.js';
import { graph } from './graph.js';
import { sleep } from '../utils.js';
Axios.defaults.xsrfCookieName = 'csrftoken';
Axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

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

export async function get_all_mail(callback_func, user) {
    try {
        const ACCESS_TOKEN = await get_access_token(user);
        const emails = await graph.getMail(ACCESS_TOKEN);
        callback_func(emails.map(e => new Email(e)));
    } catch (e) {
        console.log("Error getting email messages:");
        console.log(e);
        check_reauthenticate(e)
    }
}

export async function get_calendar(callback_func, user) {
    try {
        const ACCESS_TOKEN = await get_access_token(user);
        const events = await graph.getEvents(ACCESS_TOKEN);
        callback_func(events);
    } catch (e) {
        console.log("Error getting events:");
        console.log(e);
    }
}

export async function send_email(email, user) {
    const ACCESS_TOKEN = await get_access_token(user);
    console.log("sending email");
    const res = await graph.sendMail(ACCESS_TOKEN, email);
    console.log(res)
}

async function get_access_token(user) {
    var ACCESS_TOKEN = window.localStorage.getItem("ACCESS_TOKEN");
    if (!ACCESS_TOKEN) {
        console.log("getting token");
        try {
            const res = await Axios.post('/token/auth/get_token',
                { email_address: user.get_address() });
            ACCESS_TOKEN = res.data;
            window.localStorage.setItem("ACCESS_TOKEN", ACCESS_TOKEN);
            console.log("got token:");
            console.log(res);
        } catch (e) {
            console.log("Error getting token:");
            console.log(e);
            console.log(e.response && e.response.data)
        }
    }
    return ACCESS_TOKEN;
}

function check_reauthenticate(e) {
    if (e.body && JSON.parse(e.body).code === "InvalidAuthenticationToken") {
        window.localStorage.removeItem("ACCESS_TOKEN");
        window.open('/token', "token_window")
        sleep(2000);
    }
}