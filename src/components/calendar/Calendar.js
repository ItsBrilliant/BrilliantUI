import './Calendar.css';

import * as React from 'react';
import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject, ViewsDirective, ViewDirective } from '@syncfusion/ej2-react-schedule';
import { DataManager, Query, JsonAdaptor } from '@syncfusion/ej2-data'
import { MsgrahpAdaptor } from './CalendarConnect.js'

const done = (e) => console.log("fail: " + e);
const fail = (e) => console.log("fail: " + e);
const always = (e) => console.log("always: " + e);
export class Calendar extends React.Component {
    constructor(props) {
        super(props)
        this.bound_events = this.adjust_date_field(props.events);

    }
    adjust_date_field(events) {
        return events.map(event => {
            var new_event = {}
            for (const key of Object.keys(event_adjustment_mapping)) {
                new_event[event_adjustment_mapping[key]] = event[key]
            }
            new_event['CssClass'] = "abc987";
            return new_event;
        })
    }
    render() {

        return (
            <div className='Calendar'>
                <ScheduleComponent height="auto" width="auto" eventSettings={{ dataSource: new DataManager({ json: this.bound_events, adaptor: new MsgrahpAdaptor }) }}
                    timeScale={{ enable: true, interval: 60, slotCount: 2 }}
                    startHour='07:00' endHour='21:00'>
                    <ViewsDirective>
                        <ViewDirective option='Day'></ViewDirective>
                        <ViewDirective option='Week'></ViewDirective>
                        <ViewDirective option='Month'></ViewDirective>
                    </ViewsDirective>
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
    id: "Id",
    location: "Location"
}