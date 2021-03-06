import { Task } from '../data_objects/Task.js';
export const TasksReducer = (state = {}, action) => {
    let new_state = {};
    if (action.type === 'UPDATE_TASKS') {
        let updated_tasks = {};
        for (let task of action.tasks) {
            updated_tasks[task.id] = task;
        }
        new_state = Object.assign(state, updated_tasks);
    } else if (action.type === 'DELETE_TASKS') {
        for (const task_id of Object.keys(state).filter(
            (id) => !action.ids.includes(id)
        )) {
            new_state[task_id] = state[task_id];
        }
    } else if (action.type === 'RESET_TASKS') {
    } else {
        new_state = state;
    }
    Task.CURRENT_TASKS = new_state;
    return new_state;
};

export const SelectedTaskReducer = (state = null, action) => {
    let new_state = state;
    if (action.type === 'SELECT_TASK') {
        new_state = action.id;
    }
    return new_state;
};
