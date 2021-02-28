import { useSelector } from 'react-redux'

export function useTasks(email_id) {
    let tasks_dict = useSelector(state => state.tasks);
    let tasks = Object.values(tasks_dict)
    if (email_id) {
        tasks = tasks.filter(t => t.email_id === email_id);
    }
    return tasks;
}