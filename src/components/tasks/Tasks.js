import React, { Fragment, useState } from 'react'
import GroupedTasks from './GroupedTasks'
import { URGENT, IMPORTANT, CAN_WAIT } from '../../data_objects/Consts'
import { useTasks } from '../../hooks/redux'
import SimpleBar from 'simplebar-react'
import { TaskHeaderStyle } from './Tasks.style'
import { useSelector } from 'react-redux'


const TASK_FILTERS = ["owner", "initiator", "watchers"];
const EQUAL = (a, b) => a === b;
const FILTER_FUNCTIONS = [EQUAL, EQUAL, (a, b) => a.has(b)]

export default function Tasks() {
    const [filter_index, set_filter] = useState(0)
    const user = useSelector(state => state.user)
    const task_filter = [TASK_FILTERS[filter_index], 'approved']
    const filter_target = [user, true]
    const filter_functions = [FILTER_FUNCTIONS[filter_index], EQUAL]
    const tasks = useTasks(task_filter, filter_target, filter_functions);
    return (
        <Fragment>
            <TaskHeader selected_filter={filter_index} on_select_filter={set_filter} />
            <div style={{ height: "calc(100% - 100px)" }}>
                <SimpleBar style={{ height: "calc(100% - 100px)" }}>
                    <GroupedTasks priority={URGENT} tasks={tasks.filter(t => t.priority === URGENT)} />
                    <GroupedTasks priority={IMPORTANT} tasks={tasks.filter(t => t.priority === IMPORTANT)} />
                    <GroupedTasks priority={CAN_WAIT} tasks={tasks.filter(t => t.priority === CAN_WAIT)} />
                </SimpleBar>
            </div>
        </Fragment>
    )
}

function TaskHeader(props) {
    return (
        <TaskHeaderStyle className="header">
            <FilterButtons selected={props.selected_filter} on_select={props.on_select_filter}></FilterButtons>
            <span className="priority">Priority</span>
            <span className="owner">Owner</span>
            <span className="status">Status</span>
            <span className="watchers">Following</span>
            <span className="deadline">Due date</span>
            <span className="tags">Tags</span>
        </TaskHeaderStyle>
    );
}

function FilterButtons(props) {
    const class_names = [0, 1, 2].map(index => index === props.selected ? "selected" : null)
    return (
        <span className="filter_buttons">
            <button className={class_names[0]} onClick={() => props.on_select(0)}>My Tasks</button>
            <button className={class_names[1]} onClick={() => props.on_select(1)}> Sent tasks</button>
            <button className={class_names[2]} onClick={() => props.on_select(2)}> Following Tasks</button>
        </span>
    )
}


