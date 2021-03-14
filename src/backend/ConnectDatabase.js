import { build_task_for_database, general_axios_call, convert_to_database_value } from './utils'
import Axios from 'axios';

export async function insert_task_database(task) {
    const [db_task, all_watchers] = build_task_for_database(task);
    //  task.watchers = Array.from(task.watchers);
    const call = async () => await Axios.post('api/task_action', {
        action_type: "insert_task",
        task: db_task,
        user_emails: all_watchers
    });
    return general_axios_call(call, 'insert_task_database');

}

export async function update_task_database(task_id, update_field, value) {
    // Users to be associated with the task on the database
    let user_emails = [];
    value = convert_to_database_value(update_field, value);
    if (['initiator', 'owner'].includes(update_field)) {
        user_emails = [value];
    } else if (update_field === 'watchers') {
        user_emails = value;
    }
    const call = async () => await Axios.post('api/task_action', {
        action_type: "update_task",
        task_id: task_id,
        update_field: update_field,
        value: value,
        user_emails: user_emails
    });
    general_axios_call(call, 'update_task_database');
}

export async function get_tasks_from_database(user_email, set_tasks, updated_since = new Date(2000, 0, 1)) {
    const call = async () => await Axios.post('api/task_action', {
        action_type: "get_user_tasks",
        user_email: user_email,
        updated_since: updated_since.valueOf()
    });
    let res = await general_axios_call(call, 'get_tasks_from_database');
    // Each item in tasks is a pair: (task, is_deleted)
    const tasks = res.data;
    if (tasks.length > 0) {
        set_tasks(tasks);
    }
}

export async function delete_tasks_database(task_ids) {
    const call = async () => await Axios.post('api/task_action', {
        action_type: "delete_tasks",
        task_ids: task_ids,
    });
    general_axios_call(call, 'delete_tasks_database');
}

