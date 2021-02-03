import Axios from 'axios';
import { Email } from '../data_objects/Email.js';
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
                console.log("Error getting email attachemnts list:" + e);
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
        console.log(e);
    }
}

export async function get_all_mail(callback_func, user) {
    var chunk = 5;
    var limit = 100;
    for (let current = 0; current < limit; current += chunk) {
        try {
            const emails = await Axios.get('api/inbox', { params: { skip: current, top: chunk } })
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
        const events = await Axios.get('api/calendar', { params: { top: 100 } })
        callback_func(events.data, user);
    } catch (e) {
        console.log("Error getting events:");
        console.log(e);
    }
}

export async function get_mail_folders(callback_func, user) {
    try {
        const folders = await Axios.get('api/mail_folders');
        callback_func(folders.data, user);
    } catch (e) {
        console.log("Error getting mail folders:");
        console.log(e);
    }
}

export async function send_email(email, user) {
    console.log("sending email");
    try {
        const res = await Axios.post('api/send_mail', { email: email });
        console.log(res)
    } catch (e) {
        console.log(e);
    }
}

export async function create_based_draft(based_on_id, action_type) {
    console.log("creating draft of type " + action_type);
    const params = {
        email_id: based_on_id,
        action_type: action_type
    };
    var res;
    try {
        res = await Axios.post('api/email_action', params)
    } catch (e) {
        console.log(e);
    }
    if (!res) {
        throw Error("Couldn't create draft of type " + action_type);
    }
    return res.data;
}


export async function update_draft(email_id, email) {
    console.log("updating email");
    var res;
    var params = {
        action_type: "new",
        email: email.message
    }
    if (email_id) {
        params.email_id = email_id
        params.action_type = 'update'
    }
    try {
        res = await Axios.post('api/email_action', params);
        console.log(res);
    } catch (e) {
        console.log(e);
    }

}

export async function delete_email(email_id, folder_id) {
    try {
        console.log("deleting email");
        let res = await Axios.post('api/email_action', { action_type: 'delete', email_id: email_id });
        console.log(res);
    } catch (e) {
        console.log("Error deleting email");
        console.log(e);
    }
}

export async function update_and_send(email_id, email, user) {
    console.log("updating reply to email");
    try {
        await update_draft(email_id, email)
        console.log("sending reply to email");
        let res = await send_draft(email_id);
        console.log(res);
    } catch (e) {
        console.log(e)
    }
}

export async function send_draft(draft_id, user) {
    console.log("sending draft");
    try {
        const res = await Axios.post('api/email_action', { email_id: draft_id, action_type: "send" });
        console.log(res)
    } catch (e) {
        console.log(e)
    }

}

export async function send_reply(email, reply_id) {
    console.log("sending quick reply");
    try {
        const res = await Axios.post('api/send_mail', { email: email, reply_id: reply_id });
        console.log(res)
    } catch (e) {
        console.log(e)
    }
}