import React, { useState } from 'react';
import { TaskHeaderStyle } from './Tasks.style';
export function TaskHeader(props) {
    const headers = [
        { value: 'priority', label: 'Priority' },
        { value: 'owner', label: 'Owner' },
        { value: 'status', label: 'Status' },
        { value: 'watchers', label: 'Following' },
        { value: 'deadline', label: 'Due date' },
        { value: 'tags', label: 'Tags' },
    ];

    const reducer = (acumulator, current) => {
        acumulator[current] = false;
        return acumulator;
    };
    const [is_reversed, set_reversed] = useState(headers.reduce(reducer, {}));
    const handle_header_click = (header) => {
        const new_sort_method = {
            type: header,
            reversed: !is_reversed[header],
        };
        props.update_sort(new_sort_method);
        set_reversed(
            Object.assign(is_reversed, { [header]: !is_reversed[header] })
        );
    };

    const header_components = headers.map((h) => (
        <span
            className={h.value}
            key={h.value}
            onClick={() => handle_header_click(h.value)}
        >
            {h.label}
        </span>
    ));
    return (
        <TaskHeaderStyle className="header">
            <FilterButtons
                selected={props.selected_filter}
                on_select={props.on_select_filter}
            ></FilterButtons>
            {header_components}
        </TaskHeaderStyle>
    );
}

function FilterButtons(props) {
    const class_names = [0, 1, 2].map((index) =>
        index === props.selected ? 'selected' : null
    );
    return (
        <span className="filter_buttons">
            <button
                className={class_names[0]}
                onClick={() => props.on_select(0)}
            >
                My Tasks
            </button>
            <button
                className={class_names[1]}
                onClick={() => props.on_select(1)}
            >
                {' '}
                Sent tasks
            </button>
            <button
                className={class_names[2]}
                onClick={() => props.on_select(2)}
            >
                {' '}
                Following Tasks
            </button>
        </span>
    );
}
