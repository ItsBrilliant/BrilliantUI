import React, { useState } from 'react';
import { get_priority_style_by_name } from '../../utils.js';
import { Menu } from '../external/Menues.js';
export default function PriorityOptions(props) {
    const options = ['Urgent', 'Important', 'Can Wait', 'No Priority'];
    const [selected, set_selected] = useState(options[props.default_selection]);
    const style_class = get_priority_style_by_name(selected);
    return (
        <Menu
            style_class={props.style_class}
            value={selected}
            options={options}
            style_class={style_class}
            onChange={(sel) => {
                set_selected(sel.value);
                if (props && props.onChange) {
                    props.onChange(sel.value);
                }
            }}
        />
    );
}
