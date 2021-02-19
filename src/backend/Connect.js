import Axios from 'axios';
import { Email } from '../data_objects/Email.js';
import download from 'downloadjs'
import { update_event_version } from './utils'
Axios.defaults.xsrfCookieName = 'csrftoken';
Axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

export async function append_email_attachments(emails) {
    if (!emails) {
        return;
    }
    for (const email of emails) {
        if (email.is_new_version && email.get_has_attachments()) {
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

export async function download_attachment(email_id, attachment_id) {
    const params = {
        action_type: "download",
        email_id: email_id,
        attachment_id: attachment_id
    }
    try {
        let attachment_data = await Axios.get('api/attachment_action', { params: params });
        attachment_data = attachment_data.data;
        await download(atob(attachment_data.contentBytes), attachment_data.name);
    }
    catch (e) {
        console.log(e);
    }
}

export async function delete_attachment(email_id, attachment_id) {
    const params = {
        action_type: "delete",
        email_id: email_id,
        attachment_id: attachment_id
    }
    try {
        await Axios.get('api/attachment_action', { params: params });
    }
    catch (e) {
        console.log(e);
    }
}

export async function get_all_mail(callback_function) {
    get_mail(callback_function, 3, 100, true);
}

export async function refresh_mail(callback_function) {
    get_mail(callback_function, 1, 10, false);
}

async function get_mail(callback_function, chunk, limit, force_all = false) {
    for (let current = 0; current < limit; current += chunk) {
        try {
            const emails = await Axios.get('api/inbox', { params: { skip: current, top: chunk } })
            const email_objects = emails.data.map(e => new Email(e))
            callback_function(email_objects);
            append_email_attachments(email_objects);
            if (!force_all && (email_objects.length === 0 || !email_objects[email_objects.length - 1].is_new_version)) {
                break;
            }
        }
        catch (e) {
            console.log("Error getting email messages:");
            console.log(e);
        }
    }

}

export async function refresh_calendar(callback_function) {
    general_graph_paging_call(callback_function, update_event_version, 'api/calendar', 1, 10, false);
}

export async function get_calendar(callback_function) {
    general_graph_paging_call(callback_function, update_event_version, 'api/calendar', 10, 100, true);
}

async function general_graph_paging_call(callback_function, version_function, url, chunk, limit, force_all = false) {
    var data = [];
    var new_data = [];
    for (let current = 0; current < limit && new_data.length === data.length; current += chunk) {
        try {
            console.log(current);
            const response = await Axios.get(url, { params: { skip: current, top: chunk } })
            data = response.data;
            new_data = data.filter(d => version_function(d));
            if (!force_all && new_data.length === 0) {
                return;
            }
            callback_function(new_data);
        }
        catch (e) {
            console.log("Error getting resource from " + url);
            console.log(e);
        }
    }
}

export async function get_mail_folders(callback_func) {
    try {
        const folders = await Axios.get('api/mail_folders');
        callback_func(folders.data);
    } catch (e) {
        console.log("Error getting mail folders:");
        console.log(e);
    }
}

export async function send_email(email) {
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

export async function delete_email(email_id, hard_delete) {
    const action_type = hard_delete ? 'hard_delete' : 'delete'
    try {
        console.log("deleting email, hard_delete = " + hard_delete);
        let res = await Axios.post('api/email_action', { action_type: action_type, email_id: email_id });
        console.log(res);
    } catch (e) {
        console.log("Error deleting email");
        console.log(e);
    }
}

export async function update_and_send(email_id, email) {
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

export async function send_draft(draft_id) {
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


export async function event_action(event, event_id) {

    var params = {
        action_type: "new",
        event: event
    }
    if (event_id) {
        params.action_type = "update";
        params.event_id = event_id;
        console.log("updating event");
    } else {
        console.log("creating event");
    }
    try {
        const res = await Axios.post('api/event_action', params);
        console.log(res);
        return res;
    } catch (e) {
        console.log(e);
    }
}

export async function delete_event(event_id) {

    try {
        const res = await Axios.post('api/event_action', { action_type: "delete", event_id: event_id });
        console.log(res);
        return res;
    } catch (e) {
        console.log(e);
    }
}
