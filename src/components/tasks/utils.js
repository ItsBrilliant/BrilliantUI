export function sort_tasks(tasks, sort_methods) {
    for (const method of sort_methods) {
        let sort_function = method.reversed
            ? (a, b) => TASK_SORT_FUNCTIONS[method.type](b, a)
            : TASK_SORT_FUNCTIONS[method.type];
        tasks = tasks.sort(sort_function);
    }
    return tasks;
}

const STATUS_ORDER = ['To do', 'In progress', 'pending', 'Done'];
const TASK_SORT_FUNCTIONS = {
    owner: (t1, t2) => (t1.owner.get_name() < t2.owner.get_name() ? -1 : 1),
    status: (t1, t2) =>
        STATUS_ORDER.indexOf(t1.status) - STATUS_ORDER.indexOf(t2.status),
    watchers: (t1, t2) => t1.watchers.length - t2.watchers.length,
    deadline: (t1, t2) => t2.deadline - t1.deadline,
    tags: (t1, t2) => t1.tags.length - t2.tags.length,
    priority: (t1, t2) => t1.priority - t2.priority,
};

export const DEFAULT_SORT_METHODS = Object.keys(
    TASK_SORT_FUNCTIONS
).map((m) => ({ type: m, reversed: false }));

export function update_sort_methods(updater, new_method, old_methods) {
    console.log('updating ' + new_method.type + ' ' + new_method.reversed);
    old_methods = old_methods.filter((m) => m.type !== new_method.type);
    const new_methods = [...old_methods, new_method];
    updater(new_methods);
}
