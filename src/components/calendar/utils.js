
import { v4 } from 'uuid';
import { get_priority_style, rand_int } from '../../utils'

export function add_meetings_from_tasks(tasks, existing_meetings) {
    const existing_ids = existing_meetings.map(m => m.task_id);
    var events = [];
    for (const task of tasks.filter(t => !t.isDone && t.meeting && !existing_ids.includes(t.id))) {
        const times = task.meeting.times;
        var duration = task.meeting.duration ? task.meeting.duration.seconds : 1800
        for (const time of times) {
            let meeting_options = [];
            let priority = "suggested";
            if (time.start && time.end) {
                let available_slots = get_available_slots(existing_meetings, time.start, time.end)
                meeting_options = suggest_meeting_times_for_slots(available_slots, duration)
                priority = "suggested_options";
            } else if (time.time) {
                let end = new Date(time.time);
                end.setSeconds(end.getSeconds() + duration);
                meeting_options = [create_slot(time.time, end)];
            }
            for (const option of meeting_options) {
                let new_event =
                {
                    id: v4(),
                    location: "",
                    start: option.start,
                    end: option.end,
                    priority: priority,
                    subject: task.text,
                    task_id: task.id
                }
                events.push(new_event);
            }
        }

    }
    return events;
}

export function create_calendar_events(events) {

    for (let event of events) {
        const graph_attendees = event.attendees;
        if (typeof (event.location) === 'object') {
            event.location = event.location.displayName;
        }
        event['start'] = convert_time_to_scheduler(event['start'])
        event['end'] = convert_time_to_scheduler(event['end'])
        event['priority'] = get_priority_style(rand_int(0, 3));
        event['participants'] = graph_attendees ? graph_attendees.map(a => a ? a.emailAddress.address : "") : [];
        event['participants'] = event['participants'].filter(a => a !== "").join(',');
        event['description'] = event['body']['content']
    }

    return events
}

function convert_time_to_scheduler(d) {
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

export function convert_time_to_graph(schedule_time, zone) {
    return {
        dateTime: schedule_time.toUTCString(),
        timeZone: "UTC"
    }
}

export function get_available_slots(existing_events, slot_start, slot_end) {
    existing_events = existing_events.sort((a, b) => a.end - b.end);
    var available_slots = [];
    let current_position = slot_start;
    for (const event of existing_events) {
        if (current_position >= slot_end) {
            return available_slots;
        }
        if (event.end <= current_position) {
            continue;
        } else if (event.start > current_position) {
            available_slots.push({
                start: current_position,
                end: new Date(min(event.start, slot_end))
            });
        }
        current_position = event.end;
    }
    if (current_position < slot_end) {
        available_slots.push({
            start: current_position,
            end: slot_end
        });
    }
    return available_slots
}

function min(d1, d2) {
    if (d1.valueOf() < d2.valueOf()) {
        return d1;
    } else {
        return d2;
    }
}

export function suggest_meeting_times_for_slots(slots, meeting_duration) {
    meeting_duration = 1000 * meeting_duration;
    var meeting_times = [];
    for (let i = 0; i < slots.length; i++) {
        const slot = slots[i];
        const slot_duration_fraction = duration(slot) / meeting_duration;
        //----------------------------------- Make at least one suggestion if none were made
        if (slot_duration_fraction >= 0.8 || (meeting_times.length === 0 && i === slots.length - 1)) {
            meeting_times.push(create_slot(slot.start, slot.start.valueOf() + meeting_duration));
        }
        if (slot_duration_fraction >= 3) {
            meeting_times.push(create_slot(slot.end.valueOf() - meeting_duration, slot.end));
        }
        if (slot_duration_fraction >= 10) {
            let start = slot.start.valueOf() + (duration(slot) - meeting_duration) / 2
            meeting_times.push(create_slot(start, start + meeting_duration));
        }
    }
    return meeting_times;
}

export function create_slot(start, end) {
    return {
        start: new Date(start),
        end: new Date(end)
    }
}

export function duration(slot) {
    return (slot.end - slot.start);
}
