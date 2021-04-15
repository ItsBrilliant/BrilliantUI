import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

export function useSearchResultSelect(url, action) {
    const history = useHistory();
    const disptach = useDispatch();
    return (item) => {
        if (action) {
            disptach(action(item));
        }
        if (url) {
            history.push(url);
        }
    };
}

export function ApplyThreadFilters(threads, filters) {
    if (filters['priority'] !== undefined) {
        threads = threads.filter(
            (t) => t.get_priority() === filters['priority']
        );
    }
    return threads;
}

export function ApplyTaskFilters(tasks, filters) {
    if (filters['priority'] !== undefined) {
        tasks = tasks.filter((t) => t.priority === filters['priority']);
    }
    if (filters['tags'] !== undefined) {
        tasks = tasks.filter((t) => t.tags.includes(filters['tags']));
    }
    return tasks;
}
