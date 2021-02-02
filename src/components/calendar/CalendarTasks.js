import React, { useState } from 'react'
import './CalendarTasks.css'
import { Menu } from '../external/Menues'

export default function CalendarTasks() {
    const [sort_type, set_sort] = useState("Priority")
    return (
        <div className="CalendarTasks">
            <Header sort_type={sort_type}
                handle_sorting={set_sort}
                button_text={"..."}
                title={"Tasks"}
                sort_options={['Priority', 'Deadline']}
            />
        </div>
    )
}

export function Header(props) {
    const button = props.button_text ? <button className="header_button">{"..."}</button> : null
    return (
        <div className="header">
            <span className="header_title">{props.title}</span>
            {button}
            <Menu options={props.sort_options} label='Sort: ' value={props.sort_type} onChange={props.handle_sorting} />
        </div>
    )
}
