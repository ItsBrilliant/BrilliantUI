import React, { useState } from 'react';
import { GeneralPortal } from '../misc/GeneralPortal';
import { AddTagStyle } from './Tasks.style';

export default function AddTag(props) {
    const [visible, set_visible] = useState(false);
    const [location, set_location] = useState({ x: 0, y: 0 });

    const open_portal = (e) => {
        set_location({ x: e.pageX, y: e.pageY });
        set_visible(true);
    };
    const component = (
        <AddTagStyle location={location}>
            <TagChips
                on_items_change={props.on_items_change}
                items={props.task.tags}
            ></TagChips>
        </AddTagStyle>
    );
    return (
        <>
            <button className="add_tag" onClick={open_portal}>
                {props.task.tags.length} tags
            </button>
            <GeneralPortal
                visible={visible}
                component={component}
                handle_close={() => set_visible(false)}
            />
        </>
    );
}

function TagChips(props) {
    const [new_tag_value, set_value] = useState('');
    const handleKeyDown = (evt) => {
        if (['Enter', 'Tab'].includes(evt.key)) {
            evt.preventDefault();
            var value = new_tag_value.trim();
            if (!props.items.includes(value) && value !== '') {
                props.on_items_change([...props.items, value]);
            }
            set_value('');
        }
    };

    const handleDelete = (item) => {
        props.on_items_change(props.items.filter((i) => i !== item));
    };

    return (
        <div>
            <input
                autoComplete="off"
                className={'input'}
                value={new_tag_value}
                placeholder=""
                onKeyDown={handleKeyDown}
                onChange={(e) => set_value(e.target.value)}
            />
            {props.items.map((item) => (
                <div className="tag-item" key={item}>
                    {item}
                    <button
                        type="button"
                        className="button"
                        onClick={() => handleDelete(item)}
                    >
                        &times;
                    </button>
                </div>
            ))}
        </div>
    );
}
