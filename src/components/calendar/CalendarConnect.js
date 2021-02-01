import { JsonAdaptor } from '@syncfusion/ej2-data'
import { createElement } from '@syncfusion/ej2-base';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
export class MsgrahpAdaptor extends JsonAdaptor {
    insert() {
        console.log("my insert called")
        //calling base class processResponse function
        let original = super.insert.apply(this, arguments);
        //Adding serial number
        console.log(arguments)
        return original;
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