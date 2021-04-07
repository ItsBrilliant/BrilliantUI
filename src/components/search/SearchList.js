import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { SearchResults } from './SearchResults';
import { useEmails, useTasks } from '../../hooks/redux';
import { filter_search_objects, SEARCH_RESULT_PROPS } from './SearchResults';
import { Contact } from '../../data_objects/Contact';
import { SearchResultStyle } from './Search.style';

export function SearchList(props) {
    const all_events = useSelector((state) => state.events);
    const all_emails = useEmails();
    const all_tasks = useTasks(); //'status', 'Done', (a, b) => a !== b);
    let search_results;
    if (props.search_value.length < 2) {
        props.lock_focus();
        const select_previous_search = (search_val) => {
            props.set_search(search_val);
        };
        search_results = (
            <PreviousSearches select_previous_search={select_previous_search} />
        );
    } else {
        const conversations = filter_search_objects(
            all_emails,
            'email',
            props.search_value
        );
        const tasks = filter_search_objects(
            all_tasks,
            'task',
            props.search_value
        );
        const events = filter_search_objects(
            all_events,
            'event',
            props.search_value
        );
        const files = filter_search_objects(
            all_emails,
            'file',
            props.search_value
        );
        const contacts = filter_search_objects(
            Contact.get_all_contacts(),
            'contact',
            props.search_value
        );
        search_results = [
            ...conversations,
            ...tasks,
            ...events,
            ...files,
            ...contacts,
        ].map((x) => {
            const properties = SEARCH_RESULT_PROPS[x.type];
            return (
                <SearchResults
                    item={x.item}
                    search_value={props.search_value}
                    {...properties}
                />
            );
        });
    }

    return <div className="SearchList">{search_results}</div>;
}

function PreviousSearches(props) {
    const searches = useSelector((state) => state.searches);
    if (searches.length === 0) {
        return null;
    }
    const previous_searches = searches.map((search_val) => (
        <SearchResultStyle
            onClick={() => {
                props.select_previous_search(search_val);
            }}
        >
            <span>{search_val}</span>
        </SearchResultStyle>
    ));
    return (
        <div>
            <h3>previous searches:</h3>
            {previous_searches}
        </div>
    );
}
