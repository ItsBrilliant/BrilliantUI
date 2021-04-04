import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { SearchConversations, SearchFiles } from './conversations';
import { SearchEvents } from './events';
import { SearchTasks } from './tasks';
import { SearchContacts } from './contacts';

export function SearchList(props) {
    const list = (
        <div className="SearchList">
            <SearchConversations search_value={props.search_value} />
            <SearchEvents search_value={props.search_value} />
            <SearchTasks search_value={props.search_value} />
            <SearchFiles search_value={props.search_value} />
            <SearchContacts search_value={props.search_value} />
        </div>
    );
    return list;
    // ReactDOM.createPortal(list, document.getElementById("messages_to_user"));
}
