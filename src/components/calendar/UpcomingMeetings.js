import React, { useState } from 'react'
import { Header } from './CalendarTasks'
import { GroupIcon } from '../mail/EmailStamp'
import { Contact } from '../../data_objects/Contact'
import { format_date, get_sort_function_by_type } from '../../utils'
import './UpcomingMeetings.css'
import SimpleBar from 'simplebar-react';
import { TIME_KEY } from '../../data_objects/Consts'


export default function UpcomingMeetings(props) {
    const [sort_type, set_sort] = useState("Recent")
    const sort_function = get_sort_function_by_type(TIME_KEY)
    const sorted_meetings = props.meetings.sort((a, b) => sort_function(a.start, b.start)).reverse()
    const meetings = sorted_meetings.map(m =>
        <MeetingIcon
            key={m.id}
            meeting={m} />
    );
    return (
        <div className="UpcomingMeetings">
            <Header
                sort_type={sort_type}
                handle_sorting={set_sort}
                title="Upcoming Meetings"
                sort_options={['Recent', 'Priority']}
            />
            <div className="meetings_wrapper">
                <SimpleBar className="simple_bar" autoHide={false}>
                    <div className="meetings">
                        {meetings}
                    </div>
                </SimpleBar>
            </div>
        </div>
    )
}

function MeetingIcon(props) {
    const organizer = Contact.create_contact(props.meeting.organizer)
    const time = format_date(new Date(props.meeting.start));

    return (
        <div className="MeetingIcon">
            {GroupIcon([organizer])}
            <span className="meeting_time">{time.date + " " + time.time}</span>
        </div>
    )
}

