import { TIME_KEY, PRIORITY_KEY, URGENT, IMPORTANT, CAN_WAIT } from './data_objects/Consts.js';
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

export function create_mail_object(to, email_subject, email_content, content_type = "Text", cc = [], bcc = []) {

    function address_to_recipeint(recipeint_address) {
        const recipeint = {
            emailAddress: {
                address: recipeint_address
            }
        }
        return recipeint
    }

    const to_recipients = to.map((address) => address_to_recipeint(address));
    const cc_recipients = cc.map((address) => address_to_recipeint(address));
    const bcc_recipients = bcc.map((address) => address_to_recipeint(address));

    const email = {
        message: {
            subject: email_subject,
            body: {
                contentType: content_type,
                content: email_content
            },
            toRecipients: to_recipients,
            ccRecipients: cc_recipients,
            bccRecipients: bcc_recipients
        },
        saveToSentItems: "true"
    }
    return email;
}

export function create_calendar_events(events) {
    function convert_time_zone(d) {
        if (d.timeZone === 'UTC') {
            return new Date(d.dateTime + 'Z')
        }
        else {
            return new Date(d.dateTime)
        }
    }
    for (let event of events) {
        event['start'] = convert_time_zone(event['start'])
        event['end'] = convert_time_zone(event['end'])
    }
    return events
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function rand_int(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}



