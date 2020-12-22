import { rand_int } from '../utils.js';
export class Task {
    constructor(text, deadline, priority, isDone, source_indexes) {
        this.text = text;
        this.deadline = new Date(deadline);
        this.priority = priority;
        this.isDone = isDone;
        this.source_indexes = source_indexes || [];

    }
    get_source_indexes() {
        return this.source_indexes;
    }
}
