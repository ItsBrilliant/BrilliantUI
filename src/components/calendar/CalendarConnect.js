import { JsonAdaptor } from '@syncfusion/ej2-data'
import { createElement } from '@syncfusion/ej2-base';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { EmailChips } from '../external/EmailChips'
import ReactDOM from 'react-dom'
import React, { useState } from 'react'
import { event_action } from '../../backend/Connect'
import { address_to_recipeint, convert_time_to_graph } from '../../utils';
export class MsgrahpAdaptor extends JsonAdaptor {
    async insert() {
        console.log("my insert called")
        const event = build_event(arguments[1]);
        let res = await event_action(event);
        arguments[1] = res.data;
        var schedule_event = super.insert.apply(this, arguments);
        console.log(schedule_event)
        return schedule_event;
    }

    update() {
        console.log("my update called")
        //calling base class processResponse function
        let original = super.update.apply(this, arguments);
        //Adding serial number
        console.log(arguments)
        console.log(original)
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
        if (!args.element.querySelector('.custom-field-row')) {
            let row = createElement('div', { className: 'custom-field-row' });
            let formElement = args.element.querySelector('.e-schedule-form');
            formElement.firstChild.insertBefore(row, formElement.firstChild.firstChild);
            let container = createElement('div', { className: 'custom-field-container' });
            let inputEle = createElement('input', {
                className: 'e-field invisible', attrs: { name: 'participants' }
            });
            const set_data = (participants) => inputEle.setAttribute('value', participants);
            ReactDOM.render(<ChipsWrapper data={args.data} set_items={set_data} />, container);
            container.appendChild(inputEle);
            row.appendChild(container);
            inputEle.setAttribute('name', 'participants');
        } else {
            args.element.querySelector('input.e-field.invisible').setAttribute('value', args.data.participants);
        }
    }
}

function ChipsWrapper(props) {
    const [internal_items, internal_set_items] = useState([])
    const items = props.data.participants ? props.data.participants.split(',') : internal_items;
    const my_set_items = (items) => {
        internal_set_items(items);
        const str_items = items.join(",");
        props.set_items(str_items);
    }
    return <EmailChips
        on_items_change={my_set_items}
        items={items} />
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