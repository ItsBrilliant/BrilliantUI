import './Calendar.css';

import * as React from 'react';
import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject, ViewsDirective, ViewDirective } from '@syncfusion/ej2-react-schedule';
import { DataManager, Query, JsonAdaptor } from '@syncfusion/ej2-data'
import { MsgrahpAdaptor, onPopupOpen, onPopupOpen_template, place_priority, adjust_fields } from './CalendarConnect.js'
import UpcomingMeetings from './UpcomingMeetings';
import CalendarTasks from './CalendarTasks'
import SimpleBar from 'simplebar-react';
import './script.js'

export class Calendar extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        var events = this.props.events;//adjust_fields(this.props.events);
        return (
            <div className='Calendar'>
                <div className='scheduler'>
                    <SimpleBar className="simple_bar">
                        <ScheduleComponent height="auto" width="auto" eventSettings={
                            {
                                dataSource: new DataManager({ json: events, adaptor: new MsgrahpAdaptor }),
                                fields: {
                                    id: 'id',
                                    subject: { name: 'subject', title: 'Subject', default: "" },
                                    location: { name: 'location', title: 'Location' },
                                    description: { name: 'description', title: 'Description' },
                                    startTime: { name: 'start', title: 'Start' },
                                    endTime: { name: 'end', title: 'End End' },
                                    isAllDay: { name: 'isAllDay' },
                                }
                            }}
                            timeScale={{ enable: true, interval: 60, slotCount: 2 }}
                            startHour='06:00' endHour='24:00'
                            popupOpen={onPopupOpen}
                            renderCompleted={() => place_priority(this.props.events)}
                        //       allowDragAndDrop={true}
                        //        editorTemplate={() => <div><input classNmae="e-field" name="dov"></input></div>}
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

