import "./Calendar.css";

import * as React from "react";
import {
  ScheduleComponent,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Inject,
  ViewsDirective,
  ViewDirective,
  DragAndDrop,
  Resize,
} from "@syncfusion/ej2-react-schedule";
import { DataManager, Query, JsonAdaptor } from "@syncfusion/ej2-data";
import {
  MsgrahpAdaptor,
  onPopupOpen,
  onPopupOpen_template,
  place_priority,
  adjust_fields,
  editorTemplate,
} from "./CalendarConnect.js";
import UpcomingMeetings from "./UpcomingMeetings";
import CalendarTasks from "./CalendarTasks";
import SimpleBar from "simplebar-react";
import { connect } from "react-redux";
import { SelectCalendarDate } from "../../actions/events";
class Calendar extends React.Component {
  componentWillUnmount() {
    this.props.select_calendar_date(new Date());
  }
  render() {
    var events = this.props.events; //adjust_fields(this.props.events);
    return (
      <div className="Calendar">
        <div className="scheduler">
          <SimpleBar className="simple_bar">
            <ScheduleComponent
              height="auto"
              width="auto"
              selectedDate={this.props.selected_calendar_date}
              eventSettings={{
                dataSource: new DataManager({
                  json: events,
                  adaptor: new MsgrahpAdaptor(),
                }),
                fields: {
                  id: "id",
                  subject: { name: "subject", title: "Subject", default: "" },
                  location: { name: "location", title: "Location" },
                  description: { name: "description", title: "Description" },
                  startTime: { name: "start", title: "Start" },
                  endTime: { name: "end", title: "End End" },
                  isAllDay: { name: "isAllDay" },
                },
              }}
              timeScale={{ enable: true, interval: 60, slotCount: 2 }}
              startHour="06:00"
              endHour="24:00"
              renderCompleted={() => place_priority(this.props.events)}
              allowDragAndDrop={true}
              allowResizing={true}
              editorTemplate={editorTemplate}
            >
              <ViewsDirective>
                <ViewDirective option="Day"></ViewDirective>
                <ViewDirective option="Week"></ViewDirective>
                <ViewDirective option="Month"></ViewDirective>
              </ViewsDirective>
              <Inject services={[Day, Week, Month, DragAndDrop, Resize]} />
            </ScheduleComponent>
          </SimpleBar>
        </div>

        <div className="calendar_right_division">
          <CalendarTasks />
          <UpcomingMeetings
            meetings={this.props.events.filter((e) => e.start > Date.now())}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  selected_calendar_date: state.selected_calendar_date,
});

const mapDispatchToProps = {
  select_calendar_date: SelectCalendarDate,
};

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);
