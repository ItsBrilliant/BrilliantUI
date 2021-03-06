export default class TaskMessage {
    constructor(body, sender_email, timestamp) {
        this.body = body;
        this.sender_email = sender_email;
        this.timestamp = timestamp || new Date();
    }
}

export const DEFAULT_TASK_MESSAGE_1 = new TaskMessage("What do you think about this task?", 'dovdanon@itsbrilliant.com', new Date('2021-03-08T10:24:00'));
export const DEFAULT_TASK_MESSAGE_2 = new TaskMessage("Yes, This is a good question.", 'dovbridger@itsbrilliant.com', new Date('2021-03-08T10:29:00'));
export const DEFAULT_TASK_MESSAGE_3 = new TaskMessage("It is a very important task, we should chat about it some more here!", 'tablefloorchair23@gmail.com', new Date('2021-03-08T10:38:00'));
export const DEFAULT_TASK_MESSAGES = [DEFAULT_TASK_MESSAGE_1, DEFAULT_TASK_MESSAGE_2, DEFAULT_TASK_MESSAGE_3];