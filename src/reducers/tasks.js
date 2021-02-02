
import { Thread } from '../data_objects/Thread.js'
export const TasksReducer = (state = {}, action) => {
    if (action.type === "UPDATE") {
        let updated_task = {};
        updated_task[action.task.get_id()] = action.task
        var new_state = Object.assign({}, state);
        new_state[action.task.get_id()] = action.task;
        return new_state;
    }

    else if (action.type === "DELETE") {
        var new_state = {};
        for (const task_id of Object.keys(state).filter(id => id !== action.id)) {
            new_state[task_id] = state[task_id];
        }
        return new_state;
    }

    else if (action.type === "RESET") {
        return {};
    }

    else {
        return state;
    }
}
