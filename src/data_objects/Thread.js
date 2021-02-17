import { TIME_KEY, PRIORITY_KEY, CAN_WAIT } from "./Consts.js";
import { Email } from './Email.js'
import { delete_email } from '../backend/Connect.js'
import { Task } from './Task'

export class Thread {
    constructor(id, emails) {
        this.id = id;
        const email_objects = emails.map(e => new Email(e));
        this.emails_dict = email_objects.reduce((dict, e) => { dict[e.get_id()] = e; return dict; }, {});
    }
    static group_functions = {};
    static sort_functions = {};
    static threads = {}
    static SELECTED_FOLDER_ID = undefined;
    static get_group_function(group_type) {
        return Thread.group_functions[group_type];
    }

    static get_sort_function(sort_type) {
        return Thread.sort_functions[sort_type];
    }

    static get_filter_function(property, required_value) {
        if (property === 'sender') {
            // Check if sender of the tread is the right value
            return (sender) => sender && sender.equals(required_value);
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

    set_priority(priority) {
        this.priority = priority;
    }
    get_priority(folder_id) {
        const tasks = Object.values(Task.CURRENT_TASKS);
        if (this.priority !== undefined) {
            return this.priority;
        }
        var highest_priority = CAN_WAIT;
        for (const email of this.get_emails(folder_id)) {
            const priority = Email.get_priority(tasks, email.get_id());
            if (highest_priority > priority) {
                highest_priority = priority;
            }
        }
        return highest_priority
    }

    get_id() {
        return this.id;
    }

    get_emails(folder_id) {

        let emails = Object.values(this.emails_dict)
        //Override the filtering for now
        //      if (folder_id) {
        //           emails = emails.filter(email => email.get_folder_id() === folder_id)
        //       }
        return emails;
    }

    size() {
        return this.get_emails().length
    }

    get_email(id) {
        return this.emails_dict[id]
    }

    delete_email(id) {
        delete_email(id);
        this.emails_dict = Object.assign({}, this.emails_dict)
        delete this.emails_dict[id];
    }

    add_email(email) {
        let new_entry = {};
        new_entry[email.get_id()] = email;
        this.emails_dict = { ...this.emails_dict, ...new_entry }
    }

    get_participants(folder_id) {
        var participants = new Set()
        for (const email of this.get_emails(folder_id)) {
            const sender = email.get_sender();
            if (sender) {
                participants.add(sender);
            }
            for (const receiver of email.get_receivers().concat(email.get_ccs().concat(email.get_bccs()))) {
                participants.add(receiver);
            }
        }
        return Array.from(participants);
    }

    get_attachments(folder_id) {
        var attachments = [];
        var existing_names = [];
        for (const email of this.get_emails(folder_id)) {
            var current_attachments = email.get_attachments();
            if (current_attachments !== undefined) {
                for (const attachment of current_attachments) {
                    if (!existing_names.includes(attachment.name)) {
                        attachments.push(attachment);
                        existing_names.push(attachment.name);
                    }
                }
            }
        }
        return attachments;
    }

    get_date(folder_id) {
        var newest_date = new Date(1900, 0, 0);
        for (const email of this.get_emails(folder_id)) {
            if (newest_date.valueOf() < email.get_date().valueOf()) {
                newest_date = email.get_date();
            }
        }
        return newest_date;
    }
    mark_all_read() {
        for (const email of this.get_emails()) {
            email.set_is_read(true);
        }
    }
    delete_all() {
        console.log("Deleting all emails of thread");
        for (const email of this.get_emails()) {
            delete_email(email.get_id());
        }
    }
}

Thread.group_functions[PRIORITY_KEY] = (thread) => thread.get_priority(Thread.SELECTED_FOLDER_ID);

Thread.group_functions[TIME_KEY] = (thread) => {
    let d = thread.get_date();
    return new Date(d.getYear(), d.getMonth(), d.getDate());
}

Thread.sort_functions[PRIORITY_KEY] = (a, b) => a.get_priority(Thread.SELECTED_FOLDER_ID) - b.get_priority(Thread.SELECTED_FOLDER_ID);

Thread.sort_functions[TIME_KEY] = (a, b) => b.get_date().valueOf() - a.get_date().valueOf();
