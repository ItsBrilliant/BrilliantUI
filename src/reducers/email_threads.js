
import { Thread } from '../data_objects/Thread.js'
export const EmailThreadsReducer = (state = {}, action) => {
    if (action.type === "EXPAND") {
        var new_state = Object.assign({}, state);
        for (const email of action.emails) {
            const thread_id = email.get_thread_id();
            if (new_state[thread_id] === undefined) {
                new_state[thread_id] = new Thread(thread_id, [])
            }
            new_state[thread_id].add_email(email)
        }
        return new_state;
    }

    else if (action.type === "DELETE") {
        var new_state = {};
        for (const thread_id of Object.keys(state).filter(id => id !== action.thread_id)) {
            new_state[thread_id] = state[thread_id];
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


export function expand_threads(emails) {
    for (const email of emails) {
        const thread_id = email.get_thread_id()
        if (Thread.threads[thread_id] === undefined) {
            Thread.threads[thread_id] = new Thread(thread_id, [])
        }
        Thread.threads[thread_id].add_email(email)
    }
    return Thread.threads
}
