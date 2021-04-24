import { format_date } from '../utils.js';
import { Contact } from './Contact.js';
import { PRIORITIES, URGENT, IMPORTANT, CAN_WAIT } from './Consts.js';
import { v4 } from 'uuid';
import { create_slot } from '../components/calendar/utils.js';
import TaskMessage, { DEFAULT_TASK_MESSAGES } from './TaskMessage';
import {
    insert_task_database,
    update_task_database,
} from '../backend/ConnectDatabase';

const GENERAL_TASK_DETECTION_THRESHOLD = {
    document_request: 90,
    task_detection: 92,
};
const REQUEST_MEETING_PROBABILITY_THRESHOLD = 90;

export class Task {
    static CURRENT_TASKS = {};

    constructor(
        text,
        deadline,
        priority,
        source_indexes = [],
        owner,
        id,
        initiator
    ) {
        this.id = id ? id : v4();
        this.text = text;
        this.deadline = new Date(deadline);
        this.priority = priority;
        this.source_indexes = source_indexes;
        this.owner = owner ? owner : Contact.CURRENT_USER;
        this.initiator = initiator ? initiator : Contact.CURRENT_USER;
        this.approve_status = undefined;
        this.watchers = [this.owner];
        this.messages = []; //DEFAULT_TASK_MESSAGES;
        this.tags = [];
        this.status = 'To do';
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
        if (typeof priority === 'string') {
            this.priority = PRIORITIES.indexOf(priority);
        } else {
            this.priority = priority;
        }
        return 'priority';
    }
    approved() {
        return this.approve_status === 'approved';
    }

    declined() {
        return this.approve_status === 'declined';
    }

    is_done() {
        return this.status === 'Done';
    }
    get_formatted_deadline() {
        return format_date(this.deadline);
    }

    add_watcher(contact) {
        if (!this.watchers.includes(contact)) {
            this.watchers.push(contact);
        }
        return 'watchers';
    }

    remove_watcher(contact) {
        this.watchers = this.watchers.filter((w) => w !== contact);
        return 'watchers';
    }

    add_message(message_body) {
        const message = new TaskMessage(
            message_body,
            Contact.CURRENT_USER.get_address()
        );
        this.messages.push(message);
        return 'messages';
    }

    static get_tasks_by_email_id(
        email_id,
        tasks = Object.values(Task.CURRENT_TASKS)
    ) {
        return tasks.filter((t) => t.email_id === email_id);
    }
    static update_task(dispatcher, task, field_name, args) {
        let new_task = Object.assign(Object.create(task), task);
        if (typeof new_task[field_name] === 'function') {
            const changed_field = new_task[field_name](...args);
            update_task_database(
                new_task.id,
                changed_field,
                new_task[changed_field]
            );
        } else {
            new_task[field_name] = args;
            update_task_database(new_task.id, field_name, args);
        }

        dispatcher(new_task);
    }

    static insert_task(dispatcher, email, task) {
        if (Task.check_text_overlap(email, task)) {
            console.log(
                "Didn't add task " +
                    task.text +
                    ' ' +
                    email.get_subject() +
                    ' at indexes ' +
                    Object.values(task.source_indexes) +
                    ' because of overlap'
            );
            return;
        }
        task.email_id = email.get_id();
        task.thread_id = email.get_thread_id();
        task.add_watcher(task.initiator);
        for (const receiver of email.get_receivers()) {
            task.add_watcher(receiver);
        }
        //     if (task.approved) {
        insert_task_database(task);
        //      }
        dispatcher(task);
    }
    static check_text_overlap(email, new_task) {
        const email_tasks = email
            .get_tasks()
            .filter((t) => t.id !== new_task.id && !t.declined());
        const new_task_indexes = new_task.source_indexes;
        for (const task of email_tasks) {
            const indexes = task.source_indexes;
            if (
                indexes.start < new_task_indexes.start &&
                indexes.end >= new_task_indexes.start
            ) {
                return true;
            } else if (
                indexes.start >= new_task_indexes.start &&
                indexes.start <= new_task_indexes.end
            ) {
                return true;
            }
        }
        return false;
    }

    // task_detection is currently 'document_request'
    static add_general_task_detection(dispatcher, email, task_type) {
        const [task_detection, id] = email.get_detection(task_type);
        if (
            email.is_draft() ||
            email.is_deleted() ||
            !task_detection ||
            task_detection.length === 0
        ) {
            return;
        }
        for (let i = 0; i < task_detection.length; i++) {
            const probability = parseFloat(task_detection[i][2]);
            if (probability < GENERAL_TASK_DETECTION_THRESHOLD[task_type]) {
                continue;
            }
            const start_index = parseInt(task_detection[i][0]);
            const text_length = parseInt(task_detection[i][1]);
            var priority = URGENT;
            if (probability < 94) {
                priority = CAN_WAIT;
            } else if (probability < 97) {
                priority = IMPORTANT;
            }
            var task_text = `${task_type} (${Math.round(probability)}%)`;
            var task = new Task(
                task_text,
                new Date(),
                priority,
                { start: start_index, end: start_index + text_length },
                undefined
            );
            task.initiator = email.get_sender();
            Task.insert_task(dispatcher, email, task);
        }
    }

    static add_request_meeting_task(dispatcher, email) {
        const [meeting_scheduler, id] = email.get_detection('meeting_request');
        if (
            email.is_draft() ||
            email.is_deleted() ||
            email.added_meetings_already ||
            !meeting_scheduler ||
            meeting_scheduler.length === 0
        ) {
            return;
        }
        for (let i = 0; i < meeting_scheduler.length; i++) {
            const probability = parseFloat(meeting_scheduler[i][2]);
            if (probability < REQUEST_MEETING_PROBABILITY_THRESHOLD) {
                continue;
            }
            const start_index = parseInt(meeting_scheduler[i][0]);
            const text_length = parseInt(meeting_scheduler[i][1]);
            const slots = meeting_scheduler[i].slice(3);
            // time has either {start:, end: for 'interval', or time: for 'value'}
            let times = [];
            // duration has {value:, unit: (of value), seconds: (normalized value)}
            let durations = [];
            for (var slot of Object.values(slots)) {
                if (slot.Type === 'Duration') {
                    let duration = {
                        data: slot.Data.value,
                        unit: slot.Data.unit,
                        seconds: slot.Data.normalized.value,
                    };
                    durations.push(duration);
                    //            durations.push(duration);
                } else if (slot.Type === 'Time') {
                    let time;
                    if (slot.Data.type === 'value') {
                        time = { time: new Date(slot.Data.value) };
                        // Cancel the timezone conversion
                        time.time.setHours(time.time.getHours() - 10);
                        //                      }
                    } else if (slot.Data.type === 'interval') {
                        time = create_slot(
                            slot.Data.from.value,
                            slot.Data.to.value
                        );
                        // Cancel the timezone conversion
                        time.start.setHours(time.start.getHours() - 10);
                        time.end.setHours(time.end.getHours() - 10);
                    }
                    times.push(time);
                }
            }
            var priority = URGENT;
            if (probability < 93) {
                priority = CAN_WAIT;
            } else if (probability < 97) {
                priority = IMPORTANT;
            }
            let time_texts = times.map((time) => {
                if (time.time) {
                    return (
                        format_date(time.time).date +
                        ' ' +
                        format_date(time.time).time
                    );
                } else if (time.start && time.end) {
                    const from = format_date(time.start);
                    const to = format_date(time.end);
                    return (
                        from.date +
                        ' ' +
                        from.time +
                        ' - ' +
                        to.date +
                        ' ' +
                        to.time
                    );
                }
            });
            const time_text =
                times.length > 0
                    ? ' When: ' + time_texts.join(' | ') + ';'
                    : '';
            const duration_text =
                durations.length > 0
                    ? ' Duration: ' +
                      durations.map((d) => d.data + ' ' + d.unit).join(' | ') +
                      ';'
                    : '';
            const task_text =
                `Meeting with ${email.get_sender().get_name()} (${Math.round(
                    probability
                )}%);` +
                time_text +
                duration_text;
            var task = new Task(
                task_text,
                new Date(),
                priority,
                { start: start_index, end: start_index + text_length },
                undefined
            );
            if (times.length > 0) {
                task['meeting'] = { duration: durations[0], times: times };
            }
            task.initiator = email.get_sender();
            Task.insert_task(dispatcher, email, task);
            email.added_meetings_already = true;
        }
    }
}
