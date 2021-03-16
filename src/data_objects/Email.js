import { Contact } from './Contact.js';
import { CAN_WAIT, URGENT, IMPORTANT, NO_PRIORITY } from './Consts.js';
import { rand_int, my_html_to_text } from '../utils.js';
import { Task } from './Task.js';
import parse from 'html-react-parser'
import { mark_read } from '../backend/utils.js'

export class Email {
    static FOLDER_MAPPINGS = [];
    constructor(email_json, tags, tasks) {
        this.email = email_json;
        this.tags = tags === undefined ? [] : tags;
        this.tasks = tasks === undefined ? [] : tasks;
        this.date = new Date(this.email['sentDateTime']);
        this.attachments_dict = {}
    }

    set_attachments_dict(attachments_dict) {
        this.attachments_dict = attachments_dict;
    }
    get_attachments_names() {
        return Object.keys(this.attachments_dict);
    }

    get_attachments() {
        return this.get_attachments_names().map(name => ({
            name: name,
            id: this.attachments_dict[name],
            email_id: this.get_id()
        }))
    }
    get_attachemnt_id(name) {
        return this.attachments_dict[name];
    }

    add_random_tasks() {
        const abc = "abcdefghijklmnopqrstuvwxyz"
        var len = rand_int(3, 7);
        var name = ""
        const all_contacts = Object.values(Contact.contact_dict);
        const random_contact = all_contacts[rand_int(0, all_contacts.length)]
        const priority = rand_int(0, 3);
        if (Math.random() < 0.5) {
            for (let i = 0; i < len; i++) {
                let index = rand_int(0, 25);
                name += abc[index]
            }
            var source_indexes = { start: rand_int(0, this.get_text().length - 1) }
            source_indexes['end'] = rand_int(source_indexes.start + 1, this.get_text().length)
            var task = new Task(name, new Date(), priority, source_indexes, random_contact)
            this.tasks.push(task)
        }
    }

    get_graph_priority() {
        let score = this.email.prioritization_score;
        if (!score) {
            return NO_PRIORITY
        }
        score = parseFloat(score);
        if (score > 0.75) {
            return URGENT;
        } else if (score > 0.5) {
            return IMPORTANT;
        } else if (score > 0.25) {
            return CAN_WAIT;
        } else {
            return NO_PRIORITY;
        }
    }

    get_user_priority() {
        return this.email.user_priority;
    }

    get_tags() {
        return this.tags
    }
    get_num_tasks() {
        var count = 0;
        for (const task of this.tasks) {
            if (!task.is_done()) {
                count++;
            }
        }
        return count;
    }

    // Get priority based on the priority of unfinished tasks
    // third argument 'email' is for testing the new prioritization feature instead
    static get_priority(tasks, email_id, email) {
        const manual_user_priority = email.get_user_priority();
        if (manual_user_priority !== undefined) {
            return manual_user_priority;
        } else {
            let sender_priority = NO_PRIORITY
            if (email && !email.is_sent()) {
                sender_priority = email.get_graph_priority()
            }
            tasks = tasks.filter(t => t.email_id === email_id)
            let priorities = tasks.map(task => parseInt(task.is_done() || task.declined() ? NO_PRIORITY : task.priority));
            priorities.push(sender_priority)
            if (priorities.includes(URGENT)) {
                return URGENT;
            }
            else if (priorities.includes(IMPORTANT)) {
                return IMPORTANT;
            }
            else if (priorities.includes(CAN_WAIT)) {
                return CAN_WAIT;
            }
            else {
                return NO_PRIORITY;
            }
        }

    }
    get_tasks() {
        return Task.get_tasks_by_email_id(this.get_id());
    }

    get_id() {
        return this.email['id'];
    }

    get_sender() {
        if (!this.email['sender']) {
            return null;
        }
        return Contact.create_contact(this.email['sender']);
    }

    get_receivers() {
        let result = new Set()
        for (let contact of this.get_recipients().concat(this.get_ccs()).concat(this.get_bccs())) {
            result.add(contact);
        }
        return Array.from(result);
    }
    get_recipients() {
        return this.email['toRecipients'].map((c) => Contact.create_contact(c));
    }

    get_detection(type) {
        if (Object.keys(this.email).includes(type)) {
            return this.email[type]
        } else {
            return [];
        }
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

    get_folder_id() {
        return this.email['parentFolderId'];
    }

    get_thread_id() {
        return this.email['conversationId']
    }

    get_is_read() {
        return this.email['isRead'];
    }

    set_is_read(is_read) {
        this.email['isRead'] = is_read;
        mark_read(this.get_id(), is_read);
    }

    is_draft() {
        return this.email['isDraft'];
    }

    is_deleted() {
        return this.get_folder_id() === Email.FOLDER_MAPPINGS['Deleted Items'];
    }
    is_sent() {
        return this.get_folder_id() === Email.FOLDER_MAPPINGS['Sent Items'];
    }
    get_content() {
        return this.email['body']['content'];
    }

    get_subject() {
        return this.email['subject'];
    }

    get_content_type() {
        return this.email['body']['contentType'].toLowerCase();
    }
    get_text() {
        const content = this.get_content();
        if (this.get_content_type() === 'text') {
            return content;
        } else {
            return my_html_to_text(content)
        }
    }
    get_html() {
        const content = this.get_content();
        if (this.get_content_type() === 'html') {
            return parse(content)
        } else {
            return <p>{content}</p>
        }
    }
    get_has_attachments() {
        return this.email['hasAttachments'];
    }

}
