
import { format_date } from '../utils.js'
import { Contact } from './Contact.js'

export class Task {
    constructor(text, deadline, priority, isDone, source_indexes = [], owner) {
        this.text = text;
        this.deadline = new Date(deadline);
        this.priority = priority;
        this.isDone = isDone;
        this.source_indexes = source_indexes
        this.owner = owner ? owner : Contact.CURRENT_USER;
    }
    get_source_indexes() {
        return this.source_indexes;
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
    get_formatted_deadline() {
        return format_date(this.deadline)
    }
}
