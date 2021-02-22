
import { format_date } from '../utils.js'
import { Contact } from './Contact.js'
import { PRIORITIES, URGENT, IMPORTANT, CAN_WAIT } from './Consts.js'
import { v4 } from 'uuid';
import { create_slot } from '../components/calendar/utils.js';
import { create } from 'hbs';

const GENERAL_TASK_DETECTION_THRESHOLD = 70;
const REQUEST_MEETING_PROBABILITY_THRESHOLD = 70;


export class Task {
    static CURRENT_TASKS = {};

    constructor(text, deadline, priority, isDone, source_indexes = [], owner, id) {
        this.id = id ? id : v4();
        this.text = text;
        this.deadline = new Date(deadline);
        this.priority = priority;
        this.isDone = isDone;
        this.source_indexes = source_indexes
        this.owner = owner ? owner : Contact.CURRENT_USER;
        this.initiator = Contact.CURRENT_USER;
        this.email_id = undefined;
        this.approved = false;
    }
    get_source_indexes() {
        return this.source_indexes;
    }
    is_approved() {
        return this.approved;
    }

    set_approved(approved) {
        this.approved = approved;
    }

    set_initiator(initiator) {
        this.initiator = initiator;
    }
    get_initiator() {
        return this.initiator;
    }
    get_owner() {
        return this.owner;
    }
    get_text() {
        return this.text;
    }
    get_priority() {
        return this.priority;
    }
    set_priority(priority) {
        if (typeof (priority) === 'string') {
            this.priority = PRIORITIES.indexOf(priority);
        } else {
            this.priority = priority
        }

    }
    set_status(status) {
        if (status === "Done") {
            this.isDone = true;
        } else {
            this.isDone = false;
        }
    }
    get_formatted_deadline() {
        return format_date(this.deadline)
    }
    get_id() {
        return this.id;
    }
    get_thread_id() {
        return this.thread_id;
    }
    get_email_id() {
        return this.email_id;
    }

    static get_tasks_by_email_id(email_id, tasks = Object.values(Task.CURRENT_TASKS)) {
        return tasks.filter(t => t.email_id === email_id);
    }
    static update_task(dispatcher, task, function_name, args) {
        let new_task = Object.assign(Object.create(task), task);
        new_task[function_name](...args);
        dispatcher(new_task);
    }

    static insert_task(dispatcher, email, task) {
        if (Task.check_text_overlap(email, task)) {
            console.log("Didn't add task " + task.text + " " + email.get_subject() + " at indexes " + Object.values(task.get_source_indexes()) + " because of overlap")
            return;
        }
        task.email_id = email.get_id();
        task.thread_id = email.get_thread_id();
        task.set_initiator(email.get_sender());
        dispatcher(task);
    }
    static check_text_overlap(email, new_task) {
        const email_tasks = email.get_tasks().filter(t => t.id !== new_task.id);
        const new_task_indexes = new_task.get_source_indexes();
        for (const task of email_tasks) {
            const indexes = task.get_source_indexes();
            if (indexes.start < new_task_indexes.start && indexes.end >= new_task_indexes.start) {
                return true;
            } else if ((indexes.start >= new_task_indexes.start && indexes.start <= new_task_indexes.end)) {
                return true
            }
        }
        return false
    }
    static add_general_task_detection(dispatcher, email) {
        const [task_detection, id] = email.get_detection('task_detection');
        if (email.is_draft() || !task_detection || task_detection.length === 0) {
            return;
        }
        for (let i = 0; i < task_detection.length; i++) {
            const probability = parseFloat(task_detection[i][2])
            if (probability < GENERAL_TASK_DETECTION_THRESHOLD) {
                continue;
            }
            const start_index = parseInt(task_detection[i][0])
            const text_length = parseInt(task_detection[i][1])
            var priority = URGENT;
            if (probability < 75) {
                priority = CAN_WAIT;
            } else if (probability < 83) {
                priority = IMPORTANT;
            }
            var task_text = `auto task (${Math.round(probability)}%)`;
            var task = new Task(task_text, new Date(), priority, false, { start: start_index, end: start_index + text_length }, undefined, id)
            Task.insert_task(dispatcher, email, task);
        }
    }

    static add_request_meeting_task(dispatcher, email) {
        const [meeting_scheduler, id] = email.get_detection('meeting_request');
        if (email.is_draft() || email.is_deleted() || email.added_meetings_already || !meeting_scheduler || meeting_scheduler.length === 0) {
            return;
        }
        for (let i = 0; i < meeting_scheduler.length; i++) {
            const probability = parseFloat(meeting_scheduler[i][2])
            if (probability < REQUEST_MEETING_PROBABILITY_THRESHOLD) {
                continue;
            }
            const start_index = parseInt(meeting_scheduler[i][0])
            const text_length = parseInt(meeting_scheduler[i][1])
            const slots = meeting_scheduler[i].slice(3,);
            // time has either {start:, end: for 'interval', or time: for 'value'}
            let times = [];
            // duration has {value:, unit: (of value), seconds: (normalized value)}
            let durations = [];
            for (var slot of Object.values(slots)) {
                if (slot.Type === "Duration") {
                    let duration = {
                        data: slot.Data.value,
                        unit: slot.Data.unit,
                        seconds: slot.Data.normalized.value
                    };
                    durations.push(duration);
                    //            durations.push(duration);
                }
                else if (slot.Type === "Time") {
                    let time;
                    if (slot.Data.type === 'value') {
                        time = { time: new Date(slot.Data.value) };
                        // Cancel the timezone conversion
                        time.time.setHours(time.time.getHours() - 10);
                        //                      }
                    } else if (slot.Data.type === 'interval') {
                        time = create_slot(slot.Data.from.value, slot.Data.to.value);
                        // Cancel the timezone conversion
                        time.start.setHours(time.start.getHours() - 10);
                        time.end.setHours(time.end.getHours() - 10);
                    }
                    times.push(time);

                }
            }
            var priority = URGENT;
            if (probability < 75) {
                priority = CAN_WAIT;
            } else if (probability < 83) {
                priority = IMPORTANT;
            }
            let time_texts = times.map(time => {
                if (time.time) {
                    return format_date(time.time).date + " " + format_date(time.time).time
                } else if (time.start && time.end) {
                    return format_date(time.start).date + " " + format_date(time.start).time + "-" + format_date(time.end).time;
                }
            });
            const time_text = times.length > 0 ? " When: " + time_texts.join(" | ") + ";" : "";
            const duration_text = durations.length > 0 ? " Duration: " + durations.map(d => d.data + " " + d.unit).join(' | ') + ";" : "";
            const task_text = `Meeting with ${email.get_sender().get_name()} (${Math.round(probability)}%);` + time_text + duration_text
            var task = new Task(task_text, new Date(), priority, false, { start: start_index, end: start_index + text_length }, undefined)
            if (times.length > 0) {
                task['meeting'] = { duration: durations[0], times: times };
            }
            Task.insert_task(dispatcher, email, task);
            email.added_meetings_already = true;
        }
    }
}

