import { useSearchResultSelect } from '../../hooks/search'
import { SelectTask } from '../../actions/tasks'
import { useTasks } from '../../hooks/redux'
import { format_date } from '../../utils'
import { SearchResults } from './SearchResults'

export function SearchTasks(props) {
    const tasks = useTasks('status', 'Done', (a, b) => a !== b)
    const filter_function = (task, value) =>
        task.text.toLowerCase().includes(value.toLowerCase())
    const select_task = useSearchResultSelect('tasks', (task) =>
        SelectTask(task.id)
    )
    return (
        <SearchResults
            filter_function={filter_function}
            data={tasks}
            top_line={(task) => task.text}
            bottom_line={(task) => task.owner.get_name()}
            search_value={props.search_value}
            icon={'button_icons/task.svg'}
            max_results={5}
            time_stamp={(task) => {
                let timestamp = format_date(task.deadline)
                return timestamp.date + ' ' + timestamp.time
            }}
            my_on_click={select_task}
        ></SearchResults>
    )
}
