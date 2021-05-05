import React, { Fragment, useState } from 'react';
import ReactDOM from 'react-dom';
import GroupedTasks from './GroupedTasks';
import { URGENT, IMPORTANT, CAN_WAIT } from '../../data_objects/Consts';
import { useTasks } from '../../hooks/redux';
import SimpleBar from 'simplebar-react';
import { MultiselectActionsStyle, TasksStyle } from './Tasks.style';
import { useSelector, useDispatch } from 'react-redux';
import TaskInfoWrapper from './SingleTaskInfo';
import { Delete, SelectTask } from '../../actions/tasks';
import { delete_tasks_database } from '../../backend/ConnectDatabase';
import { DEFAULT_SORT_METHODS, update_sort_methods } from './utils';
import { TaskHeader } from './TaskHeader';

const TASK_FILTERS = ['owner', 'initiator', 'watchers'];
const EQUAL = (a, b) => a === b;
const FILTER_FUNCTIONS = [EQUAL, EQUAL, (a, b) => a.includes(b)];

export default function Tasks() {
    const [filter_index, set_filter] = useState(0);
    const [task_sort_methods, set_sort_methods] = useState(
        DEFAULT_SORT_METHODS
    );
    const user = useSelector((state) => state.user.contact);
    const dispatch = useDispatch();
    const select_task_id = (id) => dispatch(SelectTask(id));
    const selected_task_id = useSelector((state) => state.selected_task_id);
    const selected_task = useTasks('id', selected_task_id, EQUAL)[0];
    const [multiselected_tasks, set_multiselect] = useState([]);
    const task_filter = [TASK_FILTERS[filter_index], 'approve_status'];
    const filter_target = [user, 'approved'];
    const filter_functions = [FILTER_FUNCTIONS[filter_index], EQUAL];
    const tasks = useTasks(task_filter, filter_target, filter_functions);
    const group_priority_reversed = task_sort_methods.filter(
        (t) => t.type === 'priority'
    )[0].reversed;
    let priorities_order = [URGENT, IMPORTANT, CAN_WAIT];
    if (group_priority_reversed) {
        priorities_order.reverse();
    }
    const my_set_multiselect = (id) => {
        if (id && !multiselected_tasks.includes(id)) {
            set_multiselect([...multiselected_tasks, id]);
        } else {
            set_multiselect(
                multiselected_tasks.filter((task_id) => task_id != id)
            );
        }
    };
    const my_delete_tasks = (ids) => {
        dispatch(Delete(ids));
        delete_tasks_database(ids);
        set_multiselect([]);
    };
    const update_sort = (new_method) => {
        update_sort_methods(set_sort_methods, new_method, task_sort_methods);
    };
    return (
        <>
            <MultiselectActions
                on_delete={my_delete_tasks}
                multiselected_tasks={multiselected_tasks}
                on_cancel={() => set_multiselect([])}
            />
            <TasksStyle>
                <TaskHeader
                    selected_filter={filter_index}
                    on_select_filter={set_filter}
                    update_sort={update_sort}
                />
                <div style={{ height: 'calc(100% - 101px)' }}>
                    <SimpleBar style={{ height: '100%' }}>
                        <GroupedTasks
                            on_multiselect={my_set_multiselect}
                            select_task_id={select_task_id}
                            priority={priorities_order[0]}
                            tasks={tasks.filter(
                                (t) => t.priority === priorities_order[0]
                            )}
                            multiselected_tasks={multiselected_tasks}
                            sort_methods={task_sort_methods}
                        />
                        <GroupedTasks
                            on_multiselect={my_set_multiselect}
                            select_task_id={select_task_id}
                            priority={priorities_order[1]}
                            tasks={tasks.filter(
                                (t) => t.priority === priorities_order[1]
                            )}
                            multiselected_tasks={multiselected_tasks}
                            sort_methods={task_sort_methods}
                        />
                        <GroupedTasks
                            on_multiselect={my_set_multiselect}
                            select_task_id={select_task_id}
                            priority={priorities_order[2]}
                            tasks={tasks.filter(
                                (t) => t.priority === priorities_order[2]
                            )}
                            multiselected_tasks={multiselected_tasks}
                            sort_methods={task_sort_methods}
                        />
                    </SimpleBar>
                </div>
                {selected_task ? (
                    <TaskInfoWrapper
                        thread_id={selected_task.thread_id}
                        task_id={selected_task.id}
                        close={() => select_task_id(null)}
                    />
                ) : null}
            </TasksStyle>
        </>
    );
}

function MultiselectActions(props) {
    const task_word = props.multiselected_tasks.length === 1 ? 'task' : 'tasks';
    const buttons = (
        <MultiselectActionsStyle visible={props.multiselected_tasks.length > 0}>
            <span>
                {props.multiselected_tasks.length + ` ${task_word} selected`}
            </span>
            <button
                className="delete"
                onClick={() => props.on_delete(props.multiselected_tasks)}
            >
                Delete
            </button>
            <button className="cancel" onClick={props.on_cancel}>
                Cancel
            </button>
        </MultiselectActionsStyle>
    );
    return ReactDOM.createPortal(
        buttons,
        document.getElementById('messages_to_user')
    );
}
