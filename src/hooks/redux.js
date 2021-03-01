import { useSelector } from 'react-redux'

export function useTasks(filter_by, value, func = (a, b) => a === b) {
    let tasks_dict = useSelector(state => state.tasks);
    let tasks = Object.values(tasks_dict)
    if (filter_by) {
        tasks = tasks.filter(t => {
            if (typeof (filter_by) === 'string') {
                return func(t[filter_by], value);
            } else {
                // Multiple filters
                for (let i = 0; i < filter_by.length; i++) {
                    const f = func[i] ? func[i] : (a, b) => a === b
                    if (!f(t[filter_by[i]], value[i])) {
                        return false;
                    }
                }
                return true;
            }
        });
    }
    return tasks;
}