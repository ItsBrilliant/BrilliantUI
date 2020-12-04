import { TIME_KEY, PRIORITY_KEY, URGENT, IMPORTANT, CAN_WAIT } from './EmailObjects.js';
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
        for (const email of thread.emails) {
            if (filter_function(email[property])) {
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




