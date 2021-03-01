import { useSelector } from 'react-redux'

export function useTasks(filter_by, value) {
    let tasks_dict = useSelector(state => state.tasks);
    let tasks = Object.values(tasks_dict)
    if (filter_by) {
        tasks = tasks.filter(t => {
            if (typeof (filter_by) === 'string') {
                return t[filter_by] === value;
            } else {
                // Multiple filters
                for (let i = 0; i < filter_by.length; i++) {
                    if (!t[filter_by[i]] === value[i]) {
                        return false;
                    }
                }
                return true;
            }
        });
    }
    return tasks;
}