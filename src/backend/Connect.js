import Axios from 'axios';
import { Email } from '../data_objects/Email.js';
import { graph } from './graph.js';
import { sleep } from '../utils.js';
import download from 'downloadjs'
Axios.defaults.xsrfCookieName = 'csrftoken';
Axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";


export async function append_email_attachments(emails, user) {
    if (!emails) {
        return;
    }
    for (const email of emails) {
        if (email.get_has_attachments()) {
            try {
                const attachments_list = await Axios.get('api/list_attachments', { params: { email_id: email.get_id() } })
                const reducer = (acumulator, current) => {
                    acumulator[current.name] = current.id;
                    return acumulator;
                }
                email.set_attachments_dict(attachments_list.data.reduce(reducer, {}));
            }
            catch (e) {
                handle_graph_error("Error getting email attachemnts list:", e, user);
            }
        }
    }
}

export async function download_attachment(email_id, attachment_id, user) {
    const params = {
        email_id: email_id,
        attachment_id: attachment_id
    }
    try {
        let attachment_data = await Axios.get('api/download_attachment', { params: params });
        attachment_data = attachment_data.data;
        await download(atob(attachment_data.contentBytes), attachment_data.name);
    }
    catch (e) {
        handle_graph_error("Error downloading email attachment:", e, user);
    }
}

function handle_graph_error(msg, e, user) {
    console.log(msg);
    console.log(e);
    check_reauthenticate(e, user)
}

export async function get_all_mail(callback_func, user) {
    var chunk = 2;
    var limit = 50;
    for (let current = 0; current < limit; current += chunk) {
        try {
            const emails = await Axios.get('api/inbox_react', { params: { skip: current, top: chunk } })
            const email_objects = emails.data.map(e => new Email(e))
            callback_func(email_objects, user);
            append_email_attachments(email_objects, user)
        }
        catch (e) {
            console.log("Error getting email messages:");
            console.log(e);
        }
    }


}


export async function get_calendar(callback_func, user) {
    try {
        const events = await Axios.get('api/calendar_react', { params: { top: 100 } })
        callback_func(events.data, user);
    } catch (e) {
        console.log("Error getting events:");
        console.log(e);
    }
}

export async function get_mail_folders(callback_func, user) {
    try {
        const folders = await Axios.get('api/mail_folders_react');
        callback_func(folders.data, user);
    } catch (e) {
        console.log("Error getting mail folders:");
        console.log(e);
    }
}

export async function send_email(email, user) {
    const ACCESS_TOKEN = await get_access_token(user);
    console.log("sending email");
    try {
        const res = await graph.sendMail(ACCESS_TOKEN, email);
        console.log(res)
    } catch (e) {
        console.log(e);
    }
}

export async function create_based_draft(based_on_id, draft_type) {
    const ACCESS_TOKEN = await get_access_token();
    console.log("creating draft of type " + draft_type);
    var res;
    try {
        if (draft_type === 'reply') {
            res = await graph.createReply(ACCESS_TOKEN, based_on_id);
        } else if (draft_type === 'reply_all') {
            res = await graph.createReplyall(ACCESS_TOKEN, based_on_id);
        } else if (draft_type === 'forward') {
            res = await graph.createForward(ACCESS_TOKEN, based_on_id);
        }
    } catch (e) {
        console.log(e);
    }
    if (!res) {
        throw Error("Couldn't create draft of type " + draft_type);
    }
    return res;
}

export async function update_draft(email_id, email) {
    const ACCESS_TOKEN = await get_access_token();
    console.log("updating email");
    var res;
    try {
        res = await graph.updateMail(ACCESS_TOKEN, email.message, email_id);
        console.log(res);
    } catch (e) {
        console.log(e);
    }

}
export async function update_and_send(email_id, email, user) {
    const ACCESS_TOKEN = await get_access_token(user);
    console.log("updating reply to email");
    try {
        let res = await graph.updateMail(ACCESS_TOKEN, email.message, email_id);
        console.log(res)
        console.log("sending reply to email");
        res = await graph.sendDraft(ACCESS_TOKEN, email_id);
        console.log(res);
    } catch (e) {
        console.log(e)
    }
}

export async function send_draft(draft_id, user) {
    const ACCESS_TOKEN = await get_access_token(user);
    console.log("sending draft");
    try {
        const res = await graph.sendDraft(ACCESS_TOKEN, draft_id);
        console.log(res)
    } catch (e) {
        console.log(e)
    }

}

export async function send_reply(email, reply_id) {
    const ACCESS_TOKEN = await get_access_token();
    console.log("sending quick reply");
    try {
        const res = await graph.sendReply(ACCESS_TOKEN, reply_id, email);
        console.log(res)
    } catch (e) {
        console.log(e)
    }

}


async function get_access_token(user) {
    var ACCESS_TOKEN = window.localStorage.getItem(get_user_token_key(user));
    if (!ACCESS_TOKEN) {
        console.log("getting token");
        try {
            const res = await Axios.post('/token/auth/get_token',
                { email_address: user.get_address() });
            ACCESS_TOKEN = res.data;
            window.localStorage.setItem(get_user_token_key(user), ACCESS_TOKEN);
            console.log("got token:");
            console.log(res);
        } catch (e) {
            console.log("Error getting token:");
            console.log(e);
            // Set an invalid token
            ACCESS_TOKEN = "e123"
            //          open_popup_login_window();
        }
    }
    return ACCESS_TOKEN;
}

function check_reauthenticate(e, user) {
    try {
        if (e.body && JSON.parse(e.body).code === "InvalidAuthenticationToken") {
            window.localStorage.removeItem(get_user_token_key(user));
            open_popup_login_window();
        }
    }
    catch {
        console.log(e)
    }
}

function open_popup_login_window() {
    window.open('/token', "token_window")
    sleep(2000);
}

function get_user_token_key(user) {
    return "ACCESS_TOKEN";
}