import React from 'react';
import Select from 'react-select';
import { selectify } from './utils';

export default function SearchFilter(props) {
    const my_on_select = (options, action) => {
        if (action.action === 'select-option') {
            props.set_search_filters([
                ...props.search_filters,
                action.option.value,
            ]);
        } else if (action.action === 'remove-value') {
            props.set_search_filters(
                props.search_filters.filter(
                    (item) => item !== action.removedValue.value
                )
            );
        }
    };
    const options = selectify([
        'emails',
        'tasks',
        'events',
        'contacts',
        'files',
    ]);
    return (
        <Select
            styles={undefined}
            options={options}
            value={selectify(props.search_filters)}
            onChange={my_on_select}
            defaultMenuIsOpen={false}
            isMulti={true}
            placeholder="Search for emails, tasks, events, contacts and files"
        />
    );
}
