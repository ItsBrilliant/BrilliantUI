import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { FILTER_NAMES } from '../components/filter/Consts';

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
    if (filters[FILTER_NAMES.priority] !== undefined) {
        threads = threads.filter(
            (t) => t.get_priority() === filters[FILTER_NAMES.priority]
        );
    }

    if (filters[FILTER_NAMES.contact] !== undefined) {
        threads = threads.filter((t) =>
            t.get_participants(null).includes(filters[FILTER_NAMES.contact])
        );
    }
    return threads;
}

export function ApplyTaskFilters(tasks, filters) {
    if (filters[FILTER_NAMES.priority] !== undefined) {
        tasks = tasks.filter(
            (t) => t.priority === filters[FILTER_NAMES.priority]
        );
    }
    if (filters[FILTER_NAMES.tag] !== undefined) {
        tasks = tasks.filter((t) => t.tags.includes(filters[FILTER_NAMES.tag]));
    }

    if (filters[FILTER_NAMES.contact] !== undefined) {
        const contact = filters[FILTER_NAMES.contact];
        tasks = tasks.filter((t) =>
            [...t.watchers, t.owner, t.initiator].includes(contact)
        );
    }

    return tasks;
}
