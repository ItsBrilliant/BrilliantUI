
import { Thread } from '../data_objects/Thread.js'
import { Task } from '../data_objects/Task.js'
export const TasksReducer = (state = {}, action) => {
    if (action.type === "UPDATE") {
        let updated_task = {};
        updated_task[action.task.get_id()] = action.task
        var new_state = Object.assign(state, updated_task);
    }

    else if (action.type === "DELETE") {
        var new_state = {};
        for (const task_id of Object.keys(state).filter(id => id !== action.id)) {
            new_state[task_id] = state[task_id];
        }
    }

    else if (action.type === "RESET") {
        var new_state = {};
    }

    else {
        var new_state = state;
    }
    Task.CURRENT_TASKS = new_state;
    return new_state;
}
