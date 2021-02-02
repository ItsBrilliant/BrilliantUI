import React, { useState } from 'react'
import './CalendarTasks.css'
import { Menu } from '../external/Menues'
import OptionsButton from '../OptionsButton'
import { format_date, get_priority_style } from '../../utils'
import { GroupIcon } from '../mail/EmailStamp'
import { Contact } from '../../data_objects/Contact'
import SimpleBar from 'simplebar-react'

export default function CalendarTasks() {
    const [sort_type, set_sort] = useState("Priority")
    const numbers = [0, 1, 2, 3]
    const tasks = numbers.map(n => <CalendarTask
        priority={n}
        owner={Contact.create_contact_from_address("dovbridger@itsbrilliant.com")}
        watching={[
            Contact.create_contact_from_address("dovbridger@hotmail.com"),
            Contact.create_contact_from_address("tablefloorchair23@gmail.com")
        ]}
        title={"the title of the task, a very long task to be exact"}
        deadline={format_date(new Date()).date}
    />)
    return (

        <div className="CalendarTasks">
            <Header sort_type={sort_type}
                handle_sorting={set_sort}
                button_text={"..."}
                title={"Tasks"}
                sort_options={['Priority', 'Deadline']}
            />
            <div className="calendar_tasks_wrapper">
                <SimpleBar className="simple_bar">
                    {tasks}
                </SimpleBar>
            </div>
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

function CalendarTask(props) {
    var button_options = ["Quick Reply", "Set In Calendar", "Add To Topic", "Go To Source", "Mark As Done"]
    button_options = button_options.map(o => { return { name: o } });
    const priority_style = get_priority_style(props.priority);
    return (
        <div className="CalendarTask">
            <span className="title">{props.title}</span>
            <span className={"priority " + priority_style}></span>
            <span className="deadline">{props.deadline}</span>
            <span className="options"><OptionsButton options={button_options} offset={{ top: 0, left: -150 }} /></span>
            <span className="owner">{GroupIcon([props.owner], 1, 40)}</span>
            <span className="watching">{GroupIcon(props.watching, 4, 35, 25)}</span>

        </div>
    )
}
