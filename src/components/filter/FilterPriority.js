import React from 'react';
import Select from 'react-select';
import { useTaskTags } from '../../hooks/redux';

export function FilterPriority(props) {
    const options = ['Urgent', 'Important', 'Can Wait'].map((o) => ({
        label: o,
        value: o,
        filter_type: 'priority',
    }));
    return <FilterSubMenu options={options} type="priority" {...props} />;
}

export function FilterTags(props) {
    const options = useTaskTags().map((o) => ({
        label: o,
        value: o,
        filter_type: 'tags',
    }));
    return <FilterSubMenu options={options} type="tags" {...props} />;
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
                options={props.options}
                closeMenuOnSelect
                onChange={handle_change}
                defaultMenuIsOpen
            />
        </div>
    );
}
