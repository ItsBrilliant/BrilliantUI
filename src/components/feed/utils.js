import { Contact } from '../../data_objects/Contact';

export function get_slots(now, minutes_interval, last_hour) {
    const hour = now.getHours();
    const month = now.getMonth();
    const date = now.getDate();
    const year = now.getYear() + 1900;
    var slots = [];
    let slot = new Date(year, month, date, hour);
    while (slot.getHours() <= last_hour) {
        slots.push(slot);
        slot = new Date(slot.getTime() + minutes_interval * 60000);
    }
    return slots;
}

export function get_prefered_email_time(prefered_hour) {
    let now = new Date();
    return new Date(
        now.getYear() + 1900,
        now.getMonth(),
        now.getDate(),
        prefered_hour
    );
}

export function fill_meetings(slots, events) {
    let res = Array(slots.length);
    for (const event of events) {
        const slot_index = find_closest_slot(slots, event.start);
        if (res[slot_index] === undefined) {
            res[slot_index] = event;
        }
    }
    return res;
}

export function find_closest_slot(slots, time) {
    for (let i = 0; i < slots.length; i++) {
        if (slots[i] <= time) {
            if (slots[i + 1] === undefined || slots[i + 1] > time) {
                return i;
            }
        }
    }
}

export function add_feed_component(arr, component, force_index) {
    if (force_index !== undefined) {
        arr[force_index] = component;
        return true;
    }
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === undefined) {
            arr[i] = component;
            return true;
        }
    }
    return false;
}

export function is_incoming_email(email) {
    return !(
        email.is_draft() ||
        email.is_deleted() ||
        email.get_sender() === Contact.CURRENT_USER
    );
}

export function is_in_last_x_days(email, days) {
    const email_date = email.get_date();
    return get_days_diff(new Date(), email_date) < days;
}

export function get_days_diff(date1, date2) {
    const day_ms = 1000 * 60 * 60 * 24;
    return (date1 - date2) / day_ms;
}

export function group_tasks_by_source(tasks) {
    const sources = tasks.map((t) => t.get_email_id());
    let result = {};
    for (const source of sources) {
        result[source] = tasks.filter((t) => t.get_email_id() === source);
    }
    return result;
}
