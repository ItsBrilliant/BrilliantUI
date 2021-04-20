import React from 'react';
import { useThreads, useTasks, useEmails } from '../../hooks/redux';
import { email_text_area_bg } from '../misc/StyleConsts';
import { DetailedSearchResultStyle } from './SearchPage.style';
import EmailThread from '../mail/EmailThread';
import { format_date } from '../../utils';
import { CalendarTask } from '../calendar/CalendarTasks';
import { useSelector } from 'react-redux';
import {
    DetailedEventStyle,
    DetailedContactStyle,
    SearchPageWrapperStyle,
} from './SearchPage.style';
import { Contact } from '../../data_objects/Contact';
import { filter_search_objects } from './SearchResults';
import SimpleBar from 'simplebar-react';
import {
    num_conversations_with_contact,
    num_tasks_with_contact,
} from './contacts';
const MAX_RESULTS = 10;
export function SearchPage(props) {
    const search_value = useSelector(
        (state) => state.searches[state.searches.length - 1]
    );
    console.log(search_value);
    return (
        <SearchPageWrapperStyle>
            <SimpleBar className="simple_bar">
                <div style={{ height: '100%' }}>
                    <DetailedSearchResult title="Tasks">
                        <DetailedTaskResults search_value={search_value} />
                    </DetailedSearchResult>
                    <DetailedSearchResult title="Conversations">
                        <DetailedConversationResults
                            search_value={search_value}
                        />
                    </DetailedSearchResult>
                    <DetailedSearchResult title="Calendar">
                        <DetailedEventResults search_value={search_value} />
                    </DetailedSearchResult>
                    <DetailedSearchResult wrap={true} title="Contacts">
                        <DetailedContactResults search_value={search_value} />
                    </DetailedSearchResult>
                </div>
            </SimpleBar>
        </SearchPageWrapperStyle>
    );
}

function DetailedSearchResult(props) {
    return (
        <DetailedSearchResultStyle wrap={props.wrap}>
            <h1 className="header">{props.title}</h1>
            <div className="children">{props.children}</div>
        </DetailedSearchResultStyle>
    );
}

function DetailedConversationResults(props) {
    const all_emails = useEmails();
    const threads = useThreads();
    const thread_ids = filter_search_objects(
        all_emails,
        'emails',
        props.search_value
    ).map((item) => item.item.get_thread_id());
    const filtered_threads = threads
        .filter((t) => thread_ids.includes(t.id))
        .slice(0, MAX_RESULTS);
    const thread_components = filtered_threads.map((thread) => (
        <EmailThread
            key={thread.id}
            id={thread.id}
            thread={thread}
            is_selected={false}
            handle_select={() => {}}
            priority={props.priority}
            options_offset={{ top: 0, left: 15 }}
        />
    ));
    return thread_components;
}

function DetailedTaskResults(props) {
    console.log(props.search_value);
    const tasks = useTasks();
    const filtered_tasks = filter_search_objects(
        tasks,
        'tasks',
        props.search_value
    )
        .map((t) => t.item)
        .slice(0, MAX_RESULTS);
    const tasks_component = filtered_tasks.map((t) => (
        <CalendarTask
            key={t.id}
            task={t}
            priority={t.priority}
            owner={t.owner}
            watching={t.watchers}
            title={t.text}
            deadline={format_date(t.deadline).time}
            on_select={() => {}}
        />
    ));
    return tasks_component;
}

function DetailedEventResults(props) {
    const events = useSelector((state) => state.events);
    const filtered_events = filter_search_objects(
        events,
        'events',
        props.search_value
    )
        .map((e) => e.item)
        .slice(0, MAX_RESULTS);
    const events_component = filtered_events.map((event) => {
        const start = format_date(event.start);
        const end = format_date(event.end);
        return (
            <DetailedEventStyle>
                <h1 className="subject">{event.subject}</h1>
                <span className="time">
                    {start.date + ' | ' + start.time + '-' + end.time}
                </span>
            </DetailedEventStyle>
        );
    });
    return events_component;
}

function DetailedContactResults(props) {
    const contacts = Contact.get_all_contacts();
    const all_threads = useThreads();
    const all_tasks = useTasks();
    const filtered_contacts = filter_search_objects(
        contacts,
        'contacts',
        props.search_value
    )
        .map((c) => c.item)
        .slice(0, MAX_RESULTS);
    const contacts_component = filtered_contacts.map((contact) => (
        <DetailedContactStyle>
            <img className="person" src={contact.get_icon()} />
            <span className="name">{contact.get_name()} </span>
            <img className="icon" src="button_icons\task.svg" />
            <span>{num_tasks_with_contact(all_tasks, contact)}</span>
            <img className="icon" src="button_icons\mail.svg" />
            <span>{num_conversations_with_contact(all_threads, contact)}</span>
        </DetailedContactStyle>
    ));

    return contacts_component;
}
