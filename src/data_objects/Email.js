import { Contact } from './Contact.js';
import { CAN_WAIT, URGENT, IMPORTANT } from './EmailObjects.js';

export default class Email {

    constructor(email_json, tags, tasks) {
        this.email = JSON.parse(email_json)
        this.tags = tags == undefined ? [] : tags;
        this.tasks = tasks == undefined ? [] : tasks;

    }
    get_num_undone_tasks() {
        var count = 0;
        for (const task of this.tasks) {
            if (!task.isDone) {
                count++;
            }
        }
        return count;
    }

    // Get priority based on the priority of unfinished tasks
    get_priority() {
        const priorities = this.tasks.map(task => parseInt(task.isDone ? CAN_WAIT : task.priority));
        if (priorities.includes(URGENT)) {
            return URGENT;
        }
        else if (priorities.includes(IMPORTANT)) {
            return IMPORTANT;
        }
        else {
            return CAN_WAIT;
        }
    }

    add_task(task) {
        this.tasks.push(task);
    }
    get_id() {
        return this.email['id']
    }

    get_sender() {
        return new Contact(this.email.sender)
    }
    get_receivers() {
        return this.email['toRecipients'].map((c) => new Contact(c));
    }

    get_ccs() {
        return this.email['ccRecipients'].map((c) => new Contact(c));
    }
    get_bccs() {
        return this.email['bccRecipients'].map((c) => new Contact(c));
    }
    get_sent_time() {
        return this.email['sentDateTime'];
    }
    get_is_read() {
        return this.email['isRead'];
    }

    get_content() {
        return this.email['body']['content'];
    }

    get_content_type() {
        return this.email['body']['contentType'];
    }
    get_has_attachments() {
        return this.email['hasAttachments'];
    }
}
