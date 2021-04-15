import React, { useState } from 'react';
import { Contact } from '../../data_objects/Contact';
import Select from 'react-select';
import { SelectOwnerStyle } from './Tasks.style';

export function TaskOwnerSelect(props) {
    const contacts = Contact.get_all_contacts();
    const options = contacts.map((c) => ({ label: c.get_name(), value: c }));
    const handle_change = (option, action) => {
        if (action.action === 'select-option') {
            props.on_select(option.value);
        }
    };
    return (
        <SelectOwnerStyle location={props.location}>
            <Select
                options={options}
                onChange={handle_change}
                placeholder="select new owner"
                defaultMenuIsOpen={true}
                classNamePrefix="select_owner"
                closeMenuOnSelect={true}
            />
        </SelectOwnerStyle>
    );
}
