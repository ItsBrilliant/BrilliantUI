import { Contact } from './Contact.js';
import { CAN_WAIT, URGENT, IMPORTANT, NO_PRIORITY } from './Consts.js';
import { rand_int, my_html_to_text } from '../utils.js';
import { Task } from './Task.js';
import parse from 'html-react-parser'

const REQUEST_DOCUMENT_PROBABILITY_THRESHOLD = 90;
const REQUEST_MEETING_PROBABILITY_THRESHOLD = 50;
const GENERAL_TASK_DETECTION_THRESHOLD = 20;
export class Email {

    constructor(email_json, tags, tasks) {
        this.email = email_json;
        this.tags = tags === undefined ? [] : tags;
        this.tasks = tasks === undefined ? [] : tasks;
        this.date = new Date(this.email['sentDateTime']);
        if (!email_json.isDraft) {
            //        this.add_random_tasks();
            //        this.add_request_document_task();
            //          this.add_request_meeting_task();
            this.add_general_task_detection();
        }
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
        const isDone = Math.random() < 0.3;
        const priority = rand_int(0, 3);
        if (Math.random() < 0.5) {
            for (let i = 0; i < len; i++) {
                let index = rand_int(0, 25);
                name += abc[index]
            }
            var source_indexes = { start: rand_int(0, this.get_text().length - 1) }
            source_indexes['end'] = rand_int(source_indexes.start + 1, this.get_text().length)
            var task = new Task(name, new Date(), priority, isDone, source_indexes, random_contact)
            this.tasks.push(task)
        }
    }

    add_request_document_task() {
        const document_request_detection = this.email['document_request'];
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
    //**************************************************************************************** */
    add_general_task_detection() {
        const task_detection = this.email['task_detection'];
        if (!task_detection || task_detection.length === 0) {
            return;
        }
        for (let i = 0; i < task_detection.length; i++) {
            const probability = parseFloat(task_detection[i][2])
            if (probability < GENERAL_TASK_DETECTION_THRESHOLD) {
                continue;
            }
            const start_index = parseInt(task_detection[i][0])
            const text_length = parseInt(task_detection[i][1])
            const priority = parseInt((100 - probability) / 33)
            var task_text = `auto task (${Math.round(probability)}%)`;
            var task = new Task(task_text, new Date(), priority, false, { start: start_index, end: start_index + text_length })
            this.add_task(task);
        }
    }
    //**************************************************************************************** */
    add_request_meeting_task() {
        const meeting_scheduler = this.email['meeting_request'];
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
        const priorities = this.tasks.map(task => parseInt(task.isDone ? NO_PRIORITY : task.priority));
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
    get_tasks() {
        return this.tasks;
    }
    add_task(task) {
        const initiator = this.get_sender();
        if (initiator) {
            task.set_initiator(initiator);
        }
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
