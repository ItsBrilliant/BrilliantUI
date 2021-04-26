import React, { useState } from 'react';
import { main_text_color } from '../misc/StyleConsts';
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
            className={h.value + ' header'}
            key={h.value}
            onClick={() => handle_header_click(h.value)}
        >
            <span>
                {h.label}
                <Arrow reversed={is_reversed[h.value]} />
            </span>
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

function Arrow(props) {
    let style;
    if (props.reversed) {
        style = { transform: 'rotateZ(180deg)' };
    }
    return (
        <svg
            className="arrow"
            style={style}
            width="8"
            height="8"
            viewBox="0 0 10 10"
            fill={main_text_color}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M1 4L5 8M5 8L9 4M5 8V0"
                stroke="#F4F6FB"
                stroke-width="2"
            />
        </svg>
    );
}
/*        <svg
            style={style}
            className="arrow"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
        >
            <g fill={main_text_color}>
                <path
                    d="M374.176,110.386l-104-104.504c-0.006-0.006-0.013-0.011-0.019-0.018c-7.818-7.832-20.522-7.807-28.314,0.002
			c-0.006,0.006-0.013,0.011-0.019,0.018l-104,104.504c-7.791,7.829-7.762,20.493,0.068,28.285
			c7.829,7.792,20.492,7.762,28.284-0.067L236,68.442V492c0,11.046,8.954,20,20,20c11.046,0,20-8.954,20-20V68.442l69.824,70.162
			c7.792,7.829,20.455,7.859,28.284,0.067C381.939,130.878,381.966,118.214,374.176,110.386z"
                />
            </g>
        </svg>
    );
*/
