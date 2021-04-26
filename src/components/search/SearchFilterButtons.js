import React from 'react';
import Select from 'react-select';
import {
    SearchFilterButtonsStyle,
    SelectedFilterStyle,
} from './SearchFilter.style';
import { MailIcon } from '../misc/svg_icons';

const search_filter_options = {
    emails: 'Conversations',
    tasks: 'Tasks',
    events: 'Events',
    contacts: 'Contacts',
    files: 'Files',
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
            <MailIcon></MailIcon>
            <span className="filter_option_text">
                {search_filter_options[o]}
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
                {search_filter_options[props.selected_filter]}
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
