
import { format_date } from '../utils.js'
import { Contact } from './Contact.js'
import { PRIORITIES, URGENT, IMPORTANT, CAN_WAIT } from './Consts.js'
import { v4 } from 'uuid';

const GENERAL_TASK_DETECTION_THRESHOLD = 70;
const REQUEST_MEETING_PROBABILITY_THRESHOLD = 70;

export class Task {
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
    }
    get_source_indexes() {
        return this.source_indexes;
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

    static update_task(dispatcher, task, function_name, args) {
        let new_task = Object.assign(Object.create(task), task);
        new_task[function_name](...args);
        dispatcher(new_task);
    }

    static insert_task(dispatcher, email, task) {
        task.email_id = email.get_id();
        task.thread_id = email.get_thread_id();
        task.set_initiator(email.get_sender());
        dispatcher(task);
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
        if (email.is_draft() || !meeting_scheduler || meeting_scheduler.length === 0) {
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
            var times = []
            var durations = []
            for (var slot of Object.values(slots)) {
                if (slot.Type === "Duration") {
                    durations.push({
                        data: slot.Data.value,
                        unit: slot.Data.unit,
                        seconds: slot.Data.normalized.value
                    });
                }
                else if (slot.Type === "Time") {
                    times.push(new Date(slot.Data[0].value))
                }

            }
            var priority = URGENT;
            if (probability < 75) {
                priority = CAN_WAIT;
            } else if (probability < 83) {
                priority = IMPORTANT;
            }
            const time_text = times.length > 0 ? " When: " + format_date(times[0]).date + " " + format_date(times[0]).time + "; " : "";
            const duration_text = durations.length > 0 ? " Duration: " + durations[0].data + " " + durations[0].unit : "";
            const task_text = `Setup Meeting(${Math.round(probability)}%);` + time_text + duration_text
            var task = new Task(task_text, new Date(), priority, false, { start: start_index, end: start_index + text_length }, undefined, id)
            if (times.length > 0) {
                task['meeting'] = { durations: durations, times: times };
            }
            Task.insert_task(dispatcher, email, task);
        }
    }
}
