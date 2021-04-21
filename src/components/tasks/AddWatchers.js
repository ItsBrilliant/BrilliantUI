import React, { useState } from 'react';
import { Contact } from '../../data_objects/Contact';
import { GroupIcon } from '../mail/EmailStamp';
import { AddWatchersStyle } from './Tasks.style';

export default function AddWatchers(props) {
    const [search_text, set_search_text] = useState('');
    const options = Contact.get_filtered_contacts(search_text, 10);
    const handle_key_press = (e) => {
        if (e.key === 'Enter') {
            const contact = Contact.create_contact_from_address(search_text);
            props.on_select(contact);
        }
    };
    const contact_list = options.map((c) => (
        <NameWithIcon key={c} contact={c} on_select={props.on_select} />
    ));
    return (
        <AddWatchersStyle location={props.location} className="AddWatchers">
            {contact_list}
            <input
                autoFocus={true}
                className="input"
                type="text"
                value={search_text}
                onChange={(e) => set_search_text(e.target.value)}
                onKeyPress={handle_key_press}
            />
        </AddWatchersStyle>
    );
}

export function NameWithIcon(props) {
    return (
        <div
            className="NameWithIcon"
            onClick={() => props.on_select(props.contact)}
        >
            {GroupIcon([props.contact], 1, 35)}
            <span className="contact_name">{props.contact.get_name()}</span>
            {props.right_icon}
        </div>
    );
}

export function RemoveWatcher(props) {
    const watchers = props.task.watchers;
    const right_icon = <span className="minus_icon">-</span>;
    const contact_list = watchers.map((c) => (
        <NameWithIcon
            key={c}
            contact={c}
            on_select={props.on_select}
            right_icon={right_icon}
        />
    ));
    return (
        <AddWatchersStyle location={props.location} className="AddWatchers">
            {contact_list}
        </AddWatchersStyle>
    );
}
