import { PRIORITIES, TIME_KEY, PRIORITY_KEY, URGENT, IMPORTANT, CAN_WAIT } from './data_objects/Consts.js';
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function format_date(dateOjbect) {
    function get_padded_string(number) {
        if (number < 10) {
            return "0" + number;
        } else {
            return "" + number;
        }
    }
    var hours = get_padded_string(dateOjbect.getHours());
    var minutes = get_padded_string(dateOjbect.getMinutes());
    var day = get_padded_string(dateOjbect.getDate());
    var month = parseInt(dateOjbect.getMonth());
    const result = {
        time: hours + ":" + minutes,
        date: day + " " + MONTHS[month]

    };
    return result;
}

export function group_by_function(array, group_func) {
    var result = {}
    for (const element of array) {
        const group_key = group_func(element);
        if (result[group_key] === undefined) {
            result[group_key] = [];
        }
        result[group_key].push(element);
    }
    return result;
}

export function get_sort_function_by_type(sort_type) {
    if (sort_type === TIME_KEY) {
        return (a, b) => new Date(b).valueOf() - new Date(a).valueOf()
    }

    else if (sort_type === PRIORITY_KEY) {
        return (a, b) => a - b
    }
}

export function filter_by_property(array, property, filter_function) {
    const result = array.filter(function (thread) {
        for (const email of thread.get_emails()) {
            if (filter_function(property(email))) {
                return true;
            }
        }
        return false;
    })
    return result;
}

export function get_priority_style(priority_code) {
    if (priority_code == URGENT) {
        return "Urgent";
    }
    else if (priority_code == IMPORTANT) {
        return "Important";
    }
    else if (priority_code == CAN_WAIT) {
        return "CanWait";
    }
}

export function get_priority_style_by_name(priority_name) {
    return get_priority_style(PRIORITIES.indexOf(priority_name))
}
export function get_file_icon(extension) {
    var icon_name = 'attachment.png';
    if (extension === 'png' || extension === 'jpg' || extension === 'bmp' || extension === 'jpeg') {
        icon_name = 'photo.png';
    }
    else if (extension === 'xls' || extension === 'xlsx') {
        icon_name = 'xls.png';
    }
    else if (extension === 'doc' || extension === 'docx') {
        icon_name = 'doc.png';
    }
    else if (extension === 'pdf') {
        icon_name = 'pdf.png';
    }
    return 'file_icons/' + icon_name;
}

export function create_mail_object(to, email_subject, email_content, content_type = "Text", cc = [], bcc = [], attachment_buffers = []) {

    function address_to_recipeint(recipeint_address) {
        const recipeint = {
            emailAddress: {
                address: recipeint_address
            }
        }
        return recipeint
    }

    function file_buffer_to_attachment(file) {
        var attachment =
        {
            name: file.name,
            contentType: file.type,
            contentBytes: btoa(file.buffer)
        }
        attachment["@odata.type"] = "#microsoft.graph.fileAttachment";
        return attachment;

    }

    const to_recipients = to.map((address) => address_to_recipeint(address));
    const cc_recipients = cc.map((address) => address_to_recipeint(address));
    const bcc_recipients = bcc.map((address) => address_to_recipeint(address));
    if (to_recipients.length + cc_recipients.length + bcc_recipients.length === 0) {
        console.log("Email has no recipients");
    }
    const attachments = attachment_buffers.map(file =>
        file_buffer_to_attachment(file));

    var email = {
        message: {
            body: {
                contentType: content_type,
                content: email_content
            },
        },
        saveToSentItems: "true"
    }
    if (attachments) {
        email.message.attachments = attachments;
    }
    if (to_recipients.length > 0) {
        email.message.toRecipients = to_recipients;
    }
    if (cc_recipients.length > 0) {
        email.message.toRecipients = cc_recipients;
    }
    if (bcc_recipients.length > 0) {
        email.message.toRecipients = bcc_recipients;
    }
    if (email_subject) {
        email.message.subject = email_subject;
    }

    return email;
}

export function create_calendar_events(events, tasks) {
    function convert_time_zone(d) {
        if (!d.timeZone) {
            return d;
        }
        if (d.timeZone === 'UTC') {
            return new Date(d.dateTime + 'Z')
        }
        else {
            return new Date(d.dateTime)
        }
    }

    for (let event of events) {
        event['location'] = event['location']['displayName']
        event['start'] = convert_time_zone(event['start'])
        event['end'] = convert_time_zone(event['end'])
        event['priority'] = get_priority_style(rand_int(0, 3));
    }

    return events
}

export function add_meetings_from_tasks(tasks, existing_meetings) {
    const existing_ids = existing_meetings.map(m => m.task_id);
    var events = [];
    for (const task of tasks.filter(t => t.meeting && !existing_ids.includes(t.id))) {
        var start = task.meeting.times[0];
        var end = new Date(start);
        var duration = task.meeting.durations[0] ? task.meeting.durations[0].seconds : 3600
        end.setSeconds(end.getSeconds() + duration);
        var new_event =
        {
            id: task.id,
            location: "",
            start: task.meeting.times[0],
            end: end,
            priority: "suggested",
            subject: "Suggested Meeting",
            task_id: task.id
        }
        events.push(new_event);
    }
    return events;
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function rand_int(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


export function getSelectionOffsetRelativeTo(parentElement, currentNode, offset = 0) {

    var prevSibling, nodeContent;

    if (currentNode === parentElement) {
        return offset;
    }

    while (prevSibling = (prevSibling || currentNode).previousSibling) {
        nodeContent = prevSibling.innerText || prevSibling.nodeValue || "";
        offset += nodeContent.length;
    }

    return getSelectionOffsetRelativeTo(parentElement, currentNode.parentNode, offset);
}

export function my_html_to_text(html) {
    var temp = document.createElement("div");
    temp.innerHTML = html;
    var text = temp.textContent || temp.innerText || "";
    var re = new RegExp("<!--[\\s\\S]*?-->", 'g')
    var text_no_xml_comment = text.replaceAll(re, "")
    return text_no_xml_comment.trim();
}

