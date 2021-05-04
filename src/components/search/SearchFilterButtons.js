import React from 'react';
import {
    SearchFilterButtonsStyle,
    SelectedFilterStyle,
} from './SearchFilter.style';
import {
    MailIcon,
    TaskIcon,
    CalendarIcon,
    FileIcon,
    ContactIcon,
} from '../misc/svg_icons';

const search_filter_options = {
    emails: { label: 'Conversations', icon: <MailIcon /> },
    tasks: { label: 'Tasks', icon: <TaskIcon /> },
    events: { label: 'Events', icon: <CalendarIcon /> },
    contacts: { label: 'Contacts', icon: <ContactIcon /> },
    files: { label: 'Files', icon: <FileIcon /> },
};

export default function SearchFilterButtons(props) {
    if (!props.visible || props.selected_filter !== null) {
        return null;
    }
    const options = Object.keys(search_filter_options);

    const buttons = options.map((o) => (
        <button
            className="select_filter_button"
            onClick={() => props.set_selected_filter(o)}
        >
            {search_filter_options[o].icon}
            <span className="filter_option_text">
                {search_filter_options[o].label}
            </span>
        </button>
    ));
    return (
        <SearchFilterButtonsStyle>
            <div className="title">I'm searching for</div>
            <div className="filter_buttons">{buttons}</div>
        </SearchFilterButtonsStyle>
    );
}

export function SelectedFilter(props) {
    if (!props.visible || props.selected_filter === null) {
        return null;
    }
    return (
        <SelectedFilterStyle>
            <span className="filter_name">
                {search_filter_options[props.selected_filter].label}
            </span>
            <button
                onClick={() => props.set_selected_filter(null)}
                className="delete"
            >
                &times;
            </button>
        </SelectedFilterStyle>
    );
}
