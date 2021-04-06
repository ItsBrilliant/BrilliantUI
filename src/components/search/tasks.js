import { useSearchResultSelect } from '../../hooks/search';
import { SelectTask } from '../../actions/tasks';
import { useTasks } from '../../hooks/redux';
import { format_date } from '../../utils';
import { SearchResults } from './SearchResults';

export const TASK_PROPS = {
    top_line: (task) => task.text,
    bottom_line: (task) => task.owner.get_name(),
    icon: 'button_icons/task.svg',
    time_stamp: (task) => {
        let timestamp = format_date(task.deadline);
        return timestamp.date + ' ' + timestamp.time;
    },
    url: 'tasks',
    action: (task) => SelectTask(task.id),
};

export const TASK_FILTER_FUNCTION = (task, search_value) =>
    task.text.toLowerCase().includes(search_value.toLowerCase());
