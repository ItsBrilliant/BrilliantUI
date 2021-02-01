import React, { useState } from 'react'
import './CalendarTasks.css'
import { Menu } from '../external/Menues'

export default function CalendarTasks() {
    const [sort_type, set_sort] = useState("Priority")
    return (
        <div className="CalendarTasks">
            <Header sort_type={sort_type}
                handle_sorting={set_sort} />
        </div>
    )
}

function Header(props) {
    return (
        <div className="header">
            <span className="tasks_header">Tasks</span>
            <button className="tasks_button">{"..."}</button>
            <Menu options={["Priority", "Deadline"]} label='Sort: ' value={props.sort_type} onChange={props.handle_sorting} />
        </div>
    )
}
