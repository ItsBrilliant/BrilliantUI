import React from 'react'
import GroupedTasks from './GroupedTasks'
import { URGENT, IMPORTANT, CAN_WAIT } from '../../data_objects/Consts'
import { useTasks } from '../../hooks/redux'
import SimpleBar from 'simplebar-react'

export default function Tasks() {
    const tasks = useTasks();
    return (
        <div style={{ height: "calc(100% - 60px)" }}>
            <SimpleBar style={{ height: "calc(100% - 60px)" }}>
                <GroupedTasks priority={URGENT} tasks={tasks.filter(t => t.priority === URGENT)} />
                <GroupedTasks priority={IMPORTANT} tasks={tasks.filter(t => t.priority === IMPORTANT)} />
                <GroupedTasks priority={CAN_WAIT} tasks={tasks.filter(t => t.priority === CAN_WAIT)} />
            </SimpleBar>
        </div>
    )
}


