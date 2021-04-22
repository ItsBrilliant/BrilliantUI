import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { FILTER_NAMES } from '../components/filter/Consts';
import { main_text_color } from '../components/misc/StyleConsts';
import { get_priority_code_from_name } from '../utils';

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

export function ApplyEventFilters(events, filters) {
    if (filters[FILTER_NAMES.priority] !== undefined) {
        events = events.filter(
            (e) =>
                get_priority_code_from_name(e.priority) ===
                filters[FILTER_NAMES.priority]
        );
    }

    if (filters[FILTER_NAMES.contact] !== undefined) {
        events = events.filter((e) => {
            const organizer_address = e.organizer
                ? e.organizer.emailAddress.address
                : undefined;
            const attendees_addresses = e.attendees.map(
                (a) => a.emailAddress.address
            );
            return [organizer_address, ...attendees_addresses].includes(
                filters[FILTER_NAMES.contact].get_address()
            );
        });
    }
    return events;
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
