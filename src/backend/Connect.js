import Axios from 'axios';
import { Email } from '../data_objects/Email.js';
import { graph } from './graph.js';
import { sleep } from '../utils.js';
import download from 'downloadjs'
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

export async function append_email_attachments(emails, user) {
    if (!emails) {
        return;
    }
    for (const email of emails) {
        if (email.get_has_attachments()) {
            try {
                const ACCESS_TOKEN = await get_access_token(user);
                const attachments_list = await graph.getAttachmentsList(ACCESS_TOKEN, email.get_id())
                const reducer = (acumulator, current) => {
                    acumulator[current.name] = current.id;
                    return acumulator;
                }
                email.set_attachments_dict(attachments_list.value.reduce(reducer, {}));
            }
            catch (e) {
                handle_graph_error("Error getting email attachemnts list:", e, user);
            }
        }
    }
}

export async function download_attachment(email_id, attachment_id, user) {

    try {
        const ACCESS_TOKEN = await get_access_token(user);
        const attachment_data = await graph.downloadAttachment(ACCESS_TOKEN, email_id, attachment_id)
        await download(atob(attachment_data.contentBytes),
            attachment_data.name);
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
    try {
        const ACCESS_TOKEN = await get_access_token(user);
        const emails = await graph.getMail(ACCESS_TOKEN)
        const email_objects = emails.map(e => new Email(e))
        callback_func(email_objects, user);
        return email_objects;
    }
    catch (e) {
        console.log("Error getting email messages:");
        console.log(e);
        check_reauthenticate(e, user)
    }
}

export async function get_calendar(callback_func, user) {
    try {
        const ACCESS_TOKEN = await get_access_token(user);
        const events = await graph.getEvents(ACCESS_TOKEN);
        callback_func(events, user);
    } catch (e) {
        console.log("Error getting events:");
        console.log(e);
    }
}

export async function get_mail_folders(callback_func, user) {
    try {
        const ACCESS_TOKEN = await get_access_token(user);
        const folders = await graph.getMailFolders(ACCESS_TOKEN);
        callback_func(folders, user);
    } catch (e) {
        console.log("Error getting mail folders:");
        console.log(e);
    }
}

export async function send_email(email, user) {
    const ACCESS_TOKEN = await get_access_token(user);
    console.log("sending email");
    const res = await graph.sendMail(ACCESS_TOKEN, email);
    console.log(res)
}

export async function create_reply(reply_to_id, user) {
    const ACCESS_TOKEN = await get_access_token(user);
    console.log("creating reply to email");
    const res = await graph.createReply(ACCESS_TOKEN, reply_to_id);
    return res;
}

export async function create_based_draft(based_on_id, draft_type) {
    const ACCESS_TOKEN = await get_access_token();
    console.log("creating draft of type " + draft_type);
    if (draft_type === 'reply') {
        const res = graph.createReply(ACCESS_TOKEN, based_on_id);
    } if (draft_type === 'reply_all') {
        const res = graph.createReplyall(ACCESS_TOKEN, based_on_id);
    } if (draft_type === 'forward') {
        const res = graph.createForward(ACCESS_TOKEN, based_on_id);
    }
    return res;
}

export async function update_and_send(email_id, email, user) {
    const ACCESS_TOKEN = await get_access_token(user);
    console.log("updating reply to email");
    let res = await graph.updateMail(ACCESS_TOKEN, email, email_id);
    console.log(res)
    console.log("sending reply to email");
    res = await graph.sendDraft(ACCESS_TOKEN, email_id);
    console.log(res);
}

export async function send_draft(draft_id, user) {
    const ACCESS_TOKEN = await get_access_token(user);
    console.log("sending draft");
    const res = await graph.sendDraft(ACCESS_TOKEN, draft_id);
    console.log(res)
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