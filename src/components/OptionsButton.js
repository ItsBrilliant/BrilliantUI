import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './OptionsButton.css';

export default function OptionsButton(props) {
    const [visible, set_visible] = useState(false);
    const [evt, set_evt] = useState(null);
    const options_button =
        <button
            className="options_button_icon"
            onClick={(e) => { set_evt(e); set_visible(!visible) }}
        >...</button>

    const options = props.options.map(o =>
        <li
            key={o.name}
            onClick={() => {
                set_visible(false);
                if (o.action) {
                    o.action();
                }
            }}
        >{o.name}</li>)
    const options_list = visible ? <OptionsList evt={evt} options={options} offset={props.offset} /> : null;

    return (
        <div className="OptionsButton">
            {options_button}
            {options_list}
        </div>
    );
}

function OptionsList(props) {
    const custom_offset = props.offset ? props.offset : { top: 0, left: 0 }
    const top_offset = Math.min(props.evt.pageY - 15, window.visualViewport.height - 300);
    const style = {
        position: "fixed",
        top: top_offset + custom_offset.top,
        left: props.evt.pageX + custom_offset.left
    }
    return ReactDOM.createPortal(
        <ul className="options_list" style={style} > {props.options}</ul>,
        document.getElementById('messages_to_user')
    );
}
