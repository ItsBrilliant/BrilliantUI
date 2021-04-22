import { useSelector } from 'react-redux';
import {
    ApplyThreadFilters,
    ApplyTaskFilters,
    ApplyEventFilters,
} from './search';

export function useTasks(filter_by, value, func = (a, b) => a === b) {
    const filters = useSelector((state) => state.filters);
    let tasks_dict = useSelector((state) => state.tasks);
    let tasks = Object.values(tasks_dict);
    if (filter_by) {
        tasks = tasks.filter((t) => {
            if (typeof filter_by === 'string') {
                return func(t[filter_by], value);
            } else {
                // Multiple filters
                for (let i = 0; i < filter_by.length; i++) {
                    const f = func[i] ? func[i] : (a, b) => a === b;
                    if (!f(t[filter_by[i]], value[i])) {
                        return false;
                    }
                }
                return true;
            }
        });
    }
    return ApplyTaskFilters(tasks, filters);
}

export function useThreads() {
    const filters = useSelector((state) => state.filters);
    let threads_dict = useSelector((state) => state.email_threads);
    let threads = Object.values(threads_dict);
    return ApplyThreadFilters(threads, filters);
}

export function useEmails() {
    const threads = useThreads();
    let res = [];
    for (const thread of threads) {
        res = [...res, ...thread.get_emails(null)];
    }
    return res;
}

export function useEmailsHead() {
    const threads = useThreads();
    return threads.map(
        (t) => t.get_emails(null).sort((a, b) => b.date - a.date)[0]
    );
}

export function useEvents() {
    const filters = useSelector((state) => state.filters);
    const events = useSelector((state) => state.events);
    return ApplyEventFilters(events, filters);
}

export function useFilters() {
    const filters = useSelector((state) => state.filters);
    let filter_arr = [];
    for (const key in filters) {
        filter_arr.push({ type: key, value: filters[key] });
    }
    return filter_arr;
}

export function useTaskTags() {
    const tasks = useTasks();
    let all_tags = new Set();
    for (const task of tasks) {
        for (const tag of task.tags) {
            all_tags.add(tag);
        }
    }
    return Array.from(all_tags);
}
