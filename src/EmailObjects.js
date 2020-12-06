
export const URGENT = 0;
export const IMPORTANT = 1;
export const CAN_WAIT = 2;
export const PRIORITIES = ['Urgent', 'Important', 'Can Wait'];

export const TIME_KEY = 'Time';
export const PRIORITY_KEY = 'Priority';
export const CONTACT_KEY = 'Contact';

export function Contact(id, name, image_link) {
    this.id = id;
    this.name = name;
    this.image_link = image_link;
    this.first_name = this.name.split(' ')[0];
    this.last_name = this.name.split(' ')[1];
    this.equals = (other) => this.id === other.id;
    this.get_initials = (() => this.first_name[0] + '.' + this.last_name[0] + '.');
    this.get_address = (() => this.email_address)

}

export function Task(text, deadline, priority, isDone) {
    this.text = text;
    this.deadline = new Date(deadline);
    this.priority = priority;
    this.isDone = isDone;
}


export class Email {
    static id_count = 0;

    constructor(sender, receivers, content, attachments, date, isUnread, priority, tags, tasks) {
        this.id = Email.id_count;
        Email.id_count++;
        this.sender = sender;
        this.receivers = receivers;
        this.content = {
            subject: content.subject,
            text: content.text
        }
        this.attachments = attachments == undefined ? [] : attachments;
        this.date = date;
        this.isUnread = isUnread;
        this.priority = priority;
        this.tags = tags == undefined ? [] : tags;
        this.tasks = tasks == undefined ? [] : tasks;

    }

    get_email_text() {
        return this.content.text()
    }
    get_email_subject() {
        return this.content.subject()
    }

    get_sender_address() {
        return this.sender.email_address.address
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
}

export class Thread {
    constructor(id, emails) {
        this.id = id;
        this.emails = emails;
        this.emails.sort((a, b) => (b.date.valueOf() - a.date.valueOf()))
    }
    static group_functions = {
        Priority: (thread) => thread.get_priority(),
        Time: function (thread) {
            let d = thread.get_date();
            return new Date(d.getYear(), d.getMonth(), d.getDate())
        }
    };
    static get_filter_function(property, required_value) {
        if (property === 'sender') {
            return (sender) => sender.equals(required_value);
        } else if (property === 'receivers') {
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
    static sort_functions = {
        Priority: (a, b) => a.get_priority() - b.get_priority(),
        Time: (a, b) => b.get_date().valueOf() - a.get_date().valueOf()
    };

    static get_group_function(group_type) {
        return Thread.group_functions[group_type];
    }

    static get_sort_function(sort_type) {
        return Thread.sort_functions[sort_type];
    }
    get_num_tasks() {
        let count = 0;
        for (const email of this.emails) {
            count = count + email.get_num_tasks();
        }
        return count;
    }
    get_priority() {
        var highest_priority = CAN_WAIT;
        for (const email of this.emails) {
            const priority = email.get_priority();
            if (highest_priority > priority) {
                highest_priority = priority;
            }
        }
        return highest_priority
    }
    get_email(id) {
        for (const email of this.emails) {
            if (email.id === id) {
                return email;
            }
        }
        return null;
    }

    delete_email(id) {
        for (let i = 0; i < this.emails.length; i++) {
            if (this.emails[i].id === id) {
                this.emails.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    get_tasks() {
        var tasks = []
        for (const email of this.emails) {
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
        for (const email of this.emails) {
            participants.add(email.sender);
            for (const receiver of email.receivers) {
                participants.add(receiver);
            }
        }
        return Array.from(participants);
    }

    get_attachments() {
        var attachments = [];
        for (const email of this.emails) {
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
        for (const email of this.emails) {
            if (newest_date.valueOf() < email.date.valueOf()) {
                newest_date = email.date;
            }
        }
        return newest_date;
    }
}


