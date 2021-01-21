import React, { useState } from 'react'
import './OptionsButton.css';

export default function OptionsButton(props) {
    const [visible, set_visible] = useState(false);
    const options_button =
        <button
            className="options_button_icon"
            onClick={() => set_visible(!visible)}
        >...</button>

    const options = props.options.map(o =>
        <li
            key={o.name}
            onClick={() => { set_visible(false); o.action() }}
        >{o.name}</li>)
    const options_list = visible ? <ul className="options_list">{options}</ul> : null;

    return (
        <div className="OptionsButton">
            {options_button}
            {options_list}
        </div>
    );
}
