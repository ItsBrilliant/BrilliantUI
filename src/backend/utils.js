import { update_draft } from './Connect.js';
import { Contact } from '../data_objects/Contact'
import { Task } from '../data_objects/Task'

export function mark_read(email_id, is_read) {
    const email =
    {
        message: { isRead: is_read }
    }
    console.log('marking email read');
    update_draft(email_id, email).then(res => console.log(res)).catch(
        err => console.log(`error trying to mark email read: ${err}`));

}


export function update_resource_version(resource, database) {
    const current_version = database[resource.id];
    if (resource.changeKey === current_version) {
        return false;
    } else {
        database[resource.id] = resource.changeKey;
        return true;
    }
}

export function build_task_from_database(db_task) {
    let task =
        new Task(
            db_task.text, db_task.deadline, db_task.priority,
            db_task.source_indexes, undefined, db_task.id, undefined);
    task.owner = Contact.create_contact_from_address(db_task.owner);
    task.initiator = Contact.create_contact_from_address(db_task.initiator);
    task.watchers = new Set(db_task.watchers.map(w => Contact.create_contact_from_address(w)));
    task.approved = true;
    task.email_id = db_task.email_id;
    task.thread_id = db_task.thread_id;
    task.description = db_task.description;
    task.tags = db_task.tags;
    task.status = db_task.status;
    return task;
}

export function build_task_for_database(task) {
    var db_task = {};
    for (const field in task) {
        db_task[field] = convert_to_database_value(field, task[field])
    }
    let all_watchers = new Set(db_task.watchers);
    all_watchers.add(db_task.initiator);
    all_watchers.add(db_task.owner);
    //   db_task.text = task.text;
    //  db_task.owner = convert_to_database_value('owner',)
    // db_task.initiator = task.initiator.get_address();
    // db_task.watchers = convert_to_database_value("watchers", task.watchers);
    //  db_task.id = task.id;
    //  db_task.status = task.status;
    //  db_task.deadline = task.deadline;
    //  db_task.source_indexes = task.source_indexes;
    //  db_task.priority = task.priority;
    //  db_task.email_id = task.email_id;
    // db_task.thread_id = task.thread_id;
    //  db_task.tags = task.tags;
    // db_task.description = task.description;
    //  db_task.messages = task.messages;
    return [db_task, Array.from(all_watchers)];
}

export function general_axios_call(func, context) {
    console.log(context);
    try {
        const res = func();
        console.log(res);
        return res;
    } catch (e) {
        console.log(e);
    }
}

export function convert_to_database_value(field, value) {
    if (field === 'watchers') {
        return Array.from(value).map(contact => contact.get_address());
    } else if (['initiator', 'owner'].includes(field)) {
        return value.get_address();
    }
    return value;
}