import { Task } from '../data_objects/Task.js'
export const TasksReducer = (state = {}, action) => {
    if (action.type === "UPDATE_TASKS") {
        let updated_tasks = {};
        for (let task of action.tasks) {
            updated_tasks[task.id] = task;
        }
        var new_state = Object.assign(state, updated_tasks);
    }

    else if (action.type === "DELETE_TASKS") {
        var new_state = {};
        for (const task_id of Object.keys(state).filter(id => !action.ids.includes(id))) {
            new_state[task_id] = state[task_id];
        }
    }

    else if (action.type === "RESET_TASKS") {
        var new_state = {};
    }

    else {
        var new_state = state;
    }
    Task.CURRENT_TASKS = new_state;
    return new_state;
}
