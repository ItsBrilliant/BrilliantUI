import { DateTimePicker } from '@syncfusion/ej2-react-calendars';
import { Contact } from '../../data_objects/Contact';
import { format_date } from '../../utils';
import { AddTaskPortal } from '../misc/AddTaskPortal';

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

export function sort_task_by_priority_time(a, b) {
    const priority_diff = a.priority - b.priority;
    if (priority_diff !== 0) {
        return priority_diff;
    } else {
        return b.creation_time - a.creation_time;
    }
}

export function is_in_last_x_days(email, days) {
    const max_diff = days * 1000 * 60 * 60 * 24;
    const date = email.get_date();
    return new Date() - date < max_diff;
}

export function group_tasks_by_source(tasks) {
    const sources = tasks.map((t) => t.get_email_id());
    let result = {};
    for (const source of sources) {
        result[source] = tasks.filter((t) => t.get_email_id() === source);
    }
    return result;
}

export function get_add_task_portal(
    task,
    position_style,
    task_updater,
    on_create_task,
    on_close
) {
    const handle_ok = (text, date, priority, owner) => {
        task.text = text;
        task.priority = priority;
        task.deadline = date;
        task.owner = owner;
        task.approve_status = 'approved';
        task_updater(task);
        on_create_task();
    };
    return (
        <AddTaskPortal
            style={position_style}
            task_updater={task_updater}
            handle_ok={handle_ok}
            handle_close={on_close}
            priority={task.priority}
            task_text={task.text}
            date={task.deadline}
            task={task}
        />
    );
}
