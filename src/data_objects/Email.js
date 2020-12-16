import { Contact } from './Contact.js';
import { CAN_WAIT, URGENT, IMPORTANT } from './EmailObjects.js';

export class Email {

    constructor(email_json, tags, tasks) {
        this.email = email_json;
        this.tags = tags === undefined ? [] : tags;
        this.tasks = tasks === undefined ? [] : tasks;
        this.date = new Date(this.email['sentDateTime']);

    }

    get_tags() {
        return this.tags
    }
    get_num_tasks() {
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
        return this.email['id'];
    }

    get_sender() {
        return Contact.create_contact(this.email['sender']);
    }

    get_receivers() {
        return this.get_recipients().concat(this.get_ccs()).concat(this.get_bccs());
    }
    get_recipients() {
        return this.email['toRecipients'].map((c) => Contact.create_contact(c));
    }

    get_ccs() {
        return this.email['ccRecipients'].map((c) => Contact.create_contact(c));
    }

    get_bccs() {
        return this.email['bccRecipients'].map((c) => Contact.create_contact(c));
    }

    get_sent_time() {
        return this.email['sentDateTime'];
    }

    get_date() {
        return this.date;
    }

    get_thread_id() {
        return this.email['conversationId']
    }

    get_is_read() {
        return this.email['isRead'];
    }

    set_is_read(is_read) {
        this.email['isRead'] = is_read;
    }

    get_content() {
        return this.email['body']['content'];
    }

    get_subject() {
        return this.email['subject'];
    }

    get_content_type() {
        return this.email['body']['contentType'];
    }

    get_has_attachments() {
        return this.email['hasAttachments'];
    }
}
