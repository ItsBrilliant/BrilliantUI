
import { format_date } from '../utils.js'
import { Contact } from './Contact.js'
import { PRIORITIES } from './Consts.js'

export class Task {
    constructor(text, deadline, priority, isDone, source_indexes = [], owner) {
        this.text = text;
        this.deadline = new Date(deadline);
        this.priority = priority;
        this.isDone = isDone;
        this.source_indexes = source_indexes
        this.owner = owner ? owner : Contact.CURRENT_USER;
        this.initiator = Contact.CURRENT_USER;
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
}
