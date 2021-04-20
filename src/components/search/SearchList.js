import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { SearchResults } from './SearchResults';
import { useEmails, useTasks } from '../../hooks/redux';
import { filter_search_objects, SEARCH_RESULT_PROPS } from './SearchResults';
import { Contact } from '../../data_objects/Contact';
import { SearchResultStyle } from './Search.style';
import { reduce_results, get_filtered_search_results } from './utils';

const MAX_RESULTS = 15;
export function SearchList(props) {
    const all_events = useSelector((state) => state.events);
    const all_emails = useEmails();
    const all_tasks = useTasks(); //'status', 'Done', (a, b) => a !== b);
    const get_search_results = (type, data) => {
        return get_filtered_search_results(
            type,
            props.search_filters,
            filter_search_objects,
            data,
            type,
            props.search_value
        );
    };
    if (!props.visible) {
        return null;
    }
    let search_results;
    const select_previous_search = (search_val) => {
        props.set_search(search_val);
    };
    search_results = (
        <PreviousSearches
            lock_focus={props.lock_focus}
            select_previous_search={select_previous_search}
        />
    );
    if (props.search_value.length >= 2) {
        const conversations = get_search_results('emails', all_emails);
        const tasks = get_search_results('tasks', all_tasks);
        const events = get_search_results('events', all_events);
        const files = get_search_results('files', all_emails);
        const contacts = get_search_results(
            'contacts',
            Contact.get_all_contacts()
        );

        const total_num_results =
            conversations.length +
            tasks.length +
            events.length +
            files.length +
            contacts.length;
        const list = [
            ...reduce_results(conversations, total_num_results, MAX_RESULTS),
            ...reduce_results(tasks, total_num_results, MAX_RESULTS),
            ...reduce_results(events, total_num_results, MAX_RESULTS),
            ...reduce_results(files, total_num_results, MAX_RESULTS),
            ...reduce_results(contacts, total_num_results, MAX_RESULTS),
        ].map((x) => {
            const properties = SEARCH_RESULT_PROPS[x.type];
            return (
                <SearchResults
                    item={x.item}
                    search_value={props.search_value}
                    on_select={props.on_select}
                    {...properties}
                />
            );
        });
        if (list.length > 0) {
            search_results = list;
        }
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
            <h4>recent searches</h4>
            {previous_searches}
        </div>
    );
}
