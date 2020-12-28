import { TIME_KEY, PRIORITY_KEY, CAN_WAIT } from "./Consts";
import { Email } from './Email.js'

export class Thread {
    constructor(id, emails) {
        this.id = id;
        const email_objects = emails.map(e => new Email(e));
        this.emails_dict = email_objects.reduce((dict, e) => { dict[e.get_id()] = e; return dict; }, {});
    }
    static group_functions = {};
    static sort_functions = {};
    static threads = {}
    static get_group_function(group_type) {
        return Thread.group_functions[group_type];
    }

    static get_sort_function(sort_type) {
        return Thread.sort_functions[sort_type];
    }

    static get_filter_function(property, required_value) {
        if (property === 'sender') {
            // Check if sender of the tread is the right value
            return (sender) => sender.equals(required_value);
        } else if (property === 'receivers') {
            // Check if ONE of the recievers is the right value
            return function (receivers) {
                for (const contact of receivers) {
                    if (contact.equals(required_value)) {
                        return true;
                    }
                }
                return false;
            }
        }
    }

    get_num_tasks() {
        let count = 0;
        for (const email of this.get_emails()) {
            count = count + email.get_num_tasks();
        }
        return count;
    }
    get_priority() {
        var highest_priority = CAN_WAIT;
        for (const email of this.get_emails()) {
            const priority = email.get_priority();
            if (highest_priority > priority) {
                highest_priority = priority;
            }
        }
        return highest_priority
    }

    get_id() {
        return this.id;
    }

    get_emails() {
        return Object.values(this.emails_dict)
    }

    get_email(id) {
        return this.emails_dict[id]
    }

    delete_email(id) {
        delete this.emails_dict[id];
    }

    add_email(email) {
        this.emails_dict[email.get_id()] = email;
    }

    get_tasks() {
        var tasks = []
        for (const email of this.get_emails()) {
            if (email.tasks !== undefined) {
                for (const task of email.tasks) {
                    tasks.push(task);
                }
            }
        }
        return tasks;
    }

    get_participants() {
        var participants = new Set()
        for (const email of this.get_emails()) {
            participants.add(email.get_sender());
            for (const receiver of email.get_receivers().concat(email.get_ccs().concat(email.get_bccs()))) {
                participants.add(receiver);
            }
        }
        return Array.from(participants);
    }

    get_attachments() {
        var attachments = [];
        for (const email of this.get_emails()) {
            var current_attachments = email.attachments;
            if (current_attachments !== undefined) {
                for (const attachment of current_attachments) {
                    attachments.push(attachment);
                }
            }
        }
        return attachments;
    }

    get_date() {
        var newest_date = new Date(1900, 0, 0);
        for (const email of this.get_emails()) {
            if (newest_date.valueOf() < email.get_date().valueOf()) {
                newest_date = email.get_date();
            }
        }
        return newest_date;
    }
}

Thread.group_functions[PRIORITY_KEY] = (thread) => thread.get_priority();
Thread.group_functions[TIME_KEY] = (thread) => {
    let d = thread.get_date();
    return new Date(d.getYear(), d.getMonth(), d.getDate());
}

Thread.sort_functions[PRIORITY_KEY] = (a, b) => a.get_priority() - b.get_priority();
Thread.sort_functions[TIME_KEY] = (a, b) => b.get_date().valueOf() - a.get_date().valueOf();

export function expand_threads(emails) {
    for (const email of emails) {
        const thread_id = email.get_thread_id()
        if (Thread.threads[thread_id] === undefined) {
            Thread.threads[thread_id] = new Thread(thread_id, [])
        }
        Thread.threads[thread_id].add_email(email)
    }
    return Thread.threads
}