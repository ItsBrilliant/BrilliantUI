import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { SearchResults } from './SearchResults';
import { useEmails, useTasks } from '../../hooks/redux';
import { filter_search_objects, SEARCH_RESULT_PROPS } from './SearchResults';
import { Contact } from '../../data_objects/Contact';

export function SearchList(props) {
    const all_events = useSelector((state) => state.events);
    const all_emails = useEmails();
    const all_tasks = useTasks(); //'status', 'Done', (a, b) => a !== b);
    if (props.search_value.length < 2) {
        return null;
    }
    const conversations = filter_search_objects(
        all_emails,
        'email',
        props.search_value
    );
    const tasks = filter_search_objects(all_tasks, 'task', props.search_value);
    const events = filter_search_objects(
        all_events,
        'event',
        props.search_value
    );
    const files = filter_search_objects(all_emails, 'file', props.search_value);
    const contacts = filter_search_objects(
        Contact.get_all_contacts(),
        'contact',
        props.search_value
    );
    const list = [
        ...conversations,
        ...tasks,
        ...events,
        ...files,
        ...contacts,
    ].map((x) => {
        const properties = SEARCH_RESULT_PROPS[x.type];
        return (
            <div className="SearchList">
                <SearchResults
                    item={x.item}
                    search_value={props.search_value}
                    {...properties}
                />
            </div>
        );
    });
    return list;
    // ReactDOM.createPortal(list, document.getElementById("messages_to_user"));
}
