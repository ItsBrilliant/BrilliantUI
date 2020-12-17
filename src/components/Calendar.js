import './Calendar.css';

import * as React from 'react';
import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject } from '@syncfusion/ej2-react-schedule';
export class Calendar extends React.Component {
    constructor(props) {
        super(props)

    }
    adjust_date_fields() {
        return this.props.events.map(event => {
            var new_event = {}
            for (const key of Object.keys(event_adjustment_mapping)) {
                new_event[event_adjustment_mapping[key]] = event[key]
            }
            return new_event;
        })
    }
    render() {
        const events = this.adjust_date_fields();
        return (
            <div>
                <ScheduleComponent height="800px" eventSettings={{ dataSource: events }}>
                    <Inject services={[Day, Week, Month]} />
                </ScheduleComponent>
            </div>
        );
    }
}

const event_adjustment_mapping = {
    start: "StartTime",
    end: "EndTime",
    subject: "Subject",
    isAllDay: "IsAllDay",
    id: "Id"
}