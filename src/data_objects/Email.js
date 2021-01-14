import { Contact } from './Contact.js';
import { CAN_WAIT, URGENT, IMPORTANT } from './Consts.js';
import { rand_int, my_html_to_text } from '../utils.js';
import { Task } from './Task.js';
import parse from 'html-react-parser'

const REQUEST_DOCUMENT_PROBABILITY_THRESHOLD = 90;
const REQUEST_MEETING_PROBABILITY_THRESHOLD = 50;
export class Email {

    constructor(email_json, tags, tasks) {
        this.email = email_json;
        this.tags = tags === undefined ? [] : tags;
        this.tasks = tasks === undefined ? [] : tasks;
        this.date = new Date(this.email['sentDateTime']);
        this.add_request_document_task();
        this.add_request_meeting_task();
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
    add_request_document_task() {
        const document_request_detection = this.email['document_request_intention_detection'];
        if (!document_request_detection || document_request_detection.length === 0) {
            return;
        }
        for (let i = 0; i < document_request_detection.length; i++) {
            const probability = parseFloat(document_request_detection[i][2])
            if (probability < REQUEST_DOCUMENT_PROBABILITY_THRESHOLD) {
                continue;
            }
            const start_index = parseInt(document_request_detection[i][0])
            const text_length = parseInt(document_request_detection[i][1])
            var task_text = `Send the document (${Math.round(probability)}%)`;
            var task = new Task(task_text, new Date(), IMPORTANT, false, { start: start_index, end: start_index + text_length })
            this.add_task(task);
        }

    }

    add_request_meeting_task() {
        const meeting_scheduler = this.email['meeting_scheduler'];
        if (!meeting_scheduler || meeting_scheduler.length === 0) {
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
            for (var slot of slots) {
                slot = slot[0];
                if (slot.Type === "Duration") {
                    times.push(slot.Data.values[0]);
                }
                else if (slot.Type === "Time") {
                    durations.push(slot.Data)
                }

            }
            const time_text = times.length > 0 ? " Time: " + times.join(' | ') + ";" : "";
            const duration_text = durations.length > 0 ? " Duration: " + durations.join(' | ') + ";" : "";
            const task_text = `Setup Meeting(${Math.round(probability)}%);` + time_text + duration_text
            var task = new Task(task_text, new Date(), URGENT, false, { start: start_index, end: start_index + text_length })
            this.add_task(task);
        }
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
    get_tasks() {
        return this.tasks;
    }
    add_task(task) {
        this.tasks = [...this.tasks, task];
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
