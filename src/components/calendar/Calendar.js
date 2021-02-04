import './Calendar.css';

import * as React from 'react';
import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject, ViewsDirective, ViewDirective } from '@syncfusion/ej2-react-schedule';
import { DataManager, Query, JsonAdaptor } from '@syncfusion/ej2-data'
import { MsgrahpAdaptor, onPopupOpen, place_priority } from './CalendarConnect.js'
import UpcomingMeetings from './UpcomingMeetings';
import CalendarTasks from './CalendarTasks'
import SimpleBar from 'simplebar-react';
import { rand_int, get_priority_style } from '../../utils';
import './script.js'

export class Calendar extends React.Component {
    constructor(props) {
        super(props)
    }
    adjust_date_field(events) {
        return events.map(event => {
            var new_event = {}
            for (const key of Object.keys(event_adjustment_mapping)) {
                new_event[event_adjustment_mapping[key]] = event[key]
            }
            return new_event;
        })
    }

    // componentDidUpdate() {
    //       place_priority(this.props.events);
    //   }

    render() {
        var events = this.adjust_date_field(this.props.events);
        return (
            <div className='Calendar'>
                <div className='scheduler'>
                    <SimpleBar className="simple_bar">
                        <ScheduleComponent height="auto" width="auto" eventSettings={{ dataSource: new DataManager({ json: events, adaptor: new MsgrahpAdaptor }) }}
                            timeScale={{ enable: true, interval: 60, slotCount: 2 }}
                            startHour='06:00' endHour='24:00'
                            popupOpen={null}
                            appointmentTemplateId="#appTemplate"
                            renderCompleted={() => place_priority(this.props.events)}
                        >
                            <ViewsDirective>
                                <ViewDirective option='Day'></ViewDirective>
                                <ViewDirective option='Week'></ViewDirective>
                                <ViewDirective option='Month'></ViewDirective>
                            </ViewsDirective>
                            <Inject services={[Day, Week, Month]} />
                        </ScheduleComponent>
                    </SimpleBar>
                </div>

                <div className="calendar_right_division">
                    <CalendarTasks />
                    <UpcomingMeetings meetings={this.props.events.filter(e => e.start > Date.now())} />
                </div>
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
    location: "Location",
    priority: "priority"
}

function cellTemplate(props) {
    if (props.type === "workCells") {
        return (<div className="templatewrap" dangerouslySetInnerHTML={{ __html: "<p>bbbbbb</p>" }}></div>);
    }
    if (props.type === "monthCells") {
        return (<div className="templatewrap" dangerouslySetInnerHTML={{ __html: "<p>aaaaaa</p>" }}></div>);
    }
    return (<div></div>);
}
