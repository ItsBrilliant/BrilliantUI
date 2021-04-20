import React from 'react';
import Select from 'react-select';
import { useTaskTags } from '../../hooks/redux';
import { sub_menu_style } from './Filter.styles';
import { PRIORITIES } from '../../data_objects/Consts';
import { Contact } from '../../data_objects/Contact';
import { FILTER_NAMES } from './Consts';

export const MyControl = ({ children, ...rest }) => <div>{children}</div>;
export function FilterPriority(props) {
    const options = ['Urgent', 'Important', 'Can Wait'].map((o) => ({
        label: o,
        value: PRIORITIES.indexOf(o),
        filter_type: FILTER_NAMES.priority,
    }));
    return (
        <FilterSubMenu
            options={options}
            type={FILTER_NAMES.priority}
            {...props}
        />
    );
}

export function FilterTags(props) {
    const options = useTaskTags().map((o) => ({
        label: o,
        value: o,
        filter_type: FILTER_NAMES.tag,
    }));
    return (
        <FilterSubMenu options={options} type={FILTER_NAMES.tag} {...props} />
    );
}
export function FilterContacts(props) {
    const options = Contact.get_all_contacts().map((o) => ({
        label: o.get_name(),
        value: o,
        filter_type: FILTER_NAMES.contact,
    }));
    return (
        <FilterSubMenu
            options={options}
            type={FILTER_NAMES.contact}
            {...props}
        />
    );
}

export function FilterSubMenu(props) {
    if (!props.visible) {
        return null;
    }
    const handle_change = (option) => {
        props.on_select(props.type, option.value);
    };
    return (
        <div>
            <Select
                styles={sub_menu_style}
                options={props.options}
                onChange={handle_change}
                defaultMenuIsOpen={true}
                autoFocus={true}
                placeholder=""
            />
        </div>
    );
}
