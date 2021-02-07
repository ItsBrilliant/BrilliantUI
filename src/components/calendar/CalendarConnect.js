import { JsonAdaptor } from '@syncfusion/ej2-data'
import { createElement } from '@syncfusion/ej2-base';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { EmailChips } from '../external/EmailChips'
import ReactDOM from 'react-dom'
import React, { Fragment, useState } from 'react'
import { event_action, delete_event } from '../../backend/Connect'
import { address_to_recipeint, convert_time_to_graph } from '../../utils';
export class MsgrahpAdaptor extends JsonAdaptor {
    insert() {
        console.log("my insert called")
        const event = build_event(arguments[1]);
        var schedule_event = super.insert.apply(this, arguments);
        event_action(event).then(res => arguments[1].id = res.data.id);
        return schedule_event;
    }

    update() {
        console.log("my update called")
        const event = build_event(arguments[2]);
        let original = super.update.apply(this, arguments);
        event_action(event, event.id).then(res => arguments[2].id = res.data.id);
        return original;
    }

    remove() {
        console.log("my remove called")
        let original = super.remove.apply(this, arguments);
        delete_event(arguments[2].id);
        return original;
    }
}

export function place_priority(events) {
    let appointments = Array.from(document.querySelectorAll("div.e-appointment"));
    for (const event of events) {
        let a = appointments.filter(x => x.dataset.id.slice(12) === event.id);
        if (a[0]) {
            a[0].classList.add(event['priority']);
        }
    }
}

export function onPopupOpen(args) {
    if (args.type === 'Editor') {
        console.log("editor popup");
    }
}

function ChipsWrapper(props) {
    const [participants, set_participants] = useState(props.data);
    const items = participants ? participants.split(',') : [];
    const my_set_items = (items) => {
        const str_items = items.join(",");
        set_participants(str_items);
    }
    return (
        <Fragment>
            <input id="participants" className="e-field e-input" value={participants} type="text" name="participants" style={{ display: 'none' }} />
            <EmailChips
                on_items_change={my_set_items}
                items={items} />
        </Fragment>
    );
}


export function onPopupOpen_template(args) {
    if (args.type === 'Editor') {
        if (!args.element.querySelector('.custom-field-row')) {
            let row = createElement('div', { className: 'custom-field-row' });
            let formElement = args.element.querySelector('.e-schedule-form');
            formElement.firstChild.insertBefore(row, formElement.firstChild.firstChild);
            let container = createElement('div', { className: 'custom-field-container' });
            let inputEle = createElement('input', {
                className: 'e-field', attrs: { name: 'EventType' }
            });
            container.appendChild(inputEle);
            row.appendChild(container);
            let drowDownList = new DropDownList({
                dataSource: [
                    { text: 'Public Event', value: 'public-event' },
                    { text: 'Maintenance', value: 'maintenance' },
                    { text: 'Commercial Event', value: 'commercial-event' },
                    { text: 'Family Event', value: 'family-event' }
                ],
                fields: { text: 'text', value: 'value' },
                value: args.data.EventType,
                floatLabelType: 'Always', placeholder: 'Event Type'
            });
            drowDownList.appendTo(inputEle);
            inputEle.setAttribute('name', 'EventType');
        }
    }
}

const event_adjustment_mapping = {
    start: "startTime",
    end: "endTime",
    subject: "subject",
    isAllDay: "IsAllDay",
    id: "Id",
    location: "Location",
    priority: "priority"
}

function get_event_adjustment_mapping(reverse = false) {
    if (!reverse) {
        return event_adjustment_mapping;
    } else {
        let reverse_mapping = {};
        for (let key of Object.keys(event_adjustment_mapping)) {
            reverse_mapping[event_adjustment_mapping[key]] = key;
        }
        return reverse_mapping;
    }
}

export function adjust_fields(events, reverse = false) {
    const mapping = get_event_adjustment_mapping(reverse);
    return events.map(event => {
        var new_event = {}
        for (const key of Object.keys(mapping)) {
            new_event[mapping[key]] = event[key]
        }
        return new_event;
    })
}



export function build_event(schedule_event) {
    var event = {};
    event.subject = schedule_event.subject;
    event.id = schedule_event.priority === "suggested" ? undefined : schedule_event.id;
    event.start = convert_time_to_graph(schedule_event.start, schedule_event.StartTimeazne)
    event.end = convert_time_to_graph(schedule_event.end, schedule_event.EndTimezone)
    event.location = { displayName: schedule_event.location }
    event.attendees = schedule_event.participants.split(',').map(a => {
        let recipient = address_to_recipeint(a)
        recipient.type = "required";
        return recipient;
    });
    event.body = {
        contentType: "Text",
        content: schedule_event.description
    }
    event.allowNewTimeProposals = true;
    return event;
}

export function editorTemplate(props) {
    console.log("editorTemplate");
    console.log(props);
    return (props !== undefined ?
        <table className="custom-event-editor" style={{ width: '100%', cellpadding: '5' }}><tbody>
            <tr>
                <td className="e-textlabel">Attendees</td><td colSpan={4}>
                    <ChipsWrapper data={props.participants} />
                </td>
            </tr>
            <tr><td className="e-textlabel">Subject</td><td colSpan={4}>
                <input id="subject" className="e-field e-input" type="text" name="subject" style={{ width: '100%' }} />
            </td></tr>
            <tr><td className="e-textlabel">Description</td><td colSpan={4}>
                <input id="description" placeholder='' className="e-field e-input" name="description" style={{ width: '100%' }} />
            </td></tr>
            <tr><td className="e-textlabel">Location</td><td colSpan={4}>
                <input id="location" placeholder='' className="e-field e-input" name="location" style={{ width: '100%' }} />
            </td></tr>
            <tr><td className="e-textlabel">From</td><td colSpan={4}>
                <DateTimePickerComponent format='dd/MM/yy hh:mm a' id="start" data-name="start" value={new Date(props.startTime)} className="e-field"></DateTimePickerComponent>
            </td></tr>
            <tr><td className="e-textlabel">To</td><td colSpan={4}>
                <DateTimePickerComponent format='dd/MM/yy hh:mm a' id="end" data-name="end" value={new Date(props.endTime)} className="e-field"></DateTimePickerComponent>
            </td></tr></tbody>
        </table> :
        <div></div>);
}