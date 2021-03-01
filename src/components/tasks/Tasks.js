import React, { Fragment } from 'react'
import GroupedTasks from './GroupedTasks'
import { URGENT, IMPORTANT, CAN_WAIT } from '../../data_objects/Consts'
import { useTasks } from '../../hooks/redux'
import SimpleBar from 'simplebar-react'
import { TaskHeaderStyle } from './Tasks.style'

export default function Tasks() {
    const tasks = useTasks();
    return (
        <Fragment>
            <TaskHeader />
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
            <span className="filter_buttons">Filter Buttons</span>
            <span className="priority">Priority</span>
            <span className="owner">Owner</span>
            <span className="status">Status</span>
            <span className="watchers">Following</span>
            <span className="deadline">Due date</span>
            <span className="tags">Tags</span>
        </TaskHeaderStyle>
    );
}


