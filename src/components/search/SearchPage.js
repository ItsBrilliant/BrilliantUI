import React from 'react';
import { useThreads, useTasks } from '../../hooks/redux';
import { email_text_area_bg } from '../StyleConsts';
import { DetailedSearchResultStyle } from './SearchPage.style';
import EmailThread from '../mail/EmailThread';
import { format_date } from '../../utils';
import { CalendarTask } from '../calendar/CalendarTasks';
import { useSelector } from 'react-redux';
import { DetailedEventStyle, DetailedContactStyle } from './SearchPage.style';
import { Contact } from '../../data_objects/Contact';
export function SearchPage(props) {
    return (
        <div>
            <DetailedSearchResult title="Tasks">
                <DetailedTaskResults />
            </DetailedSearchResult>
            <DetailedSearchResult title="Conversations">
                <DetailedConversationResults />
            </DetailedSearchResult>
            <DetailedSearchResult title="Calendar">
                <DetailedEventResults />
            </DetailedSearchResult>
            <DetailedSearchResult wrap={true} title="Contacts">
                <DetailedContactResults />
            </DetailedSearchResult>
        </div>
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
    const threads = useThreads().slice(0, 5);
    const thread_components = threads.map((thread) => (
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
    const tasks = useTasks().slice(0, 5);
    const tasks_component = tasks.map((t) => (
        <CalendarTask
            key={t.id}
            task={t}
            priority={t.priority}
            owner={t.owner}
            watching={t.watchers}
            title={t.text}
            deadline={format_date(t.deadline).time}
            on_select={props.on_select}
        />
    ));
    return tasks_component;
}

function DetailedEventResults(props) {
    const events = useSelector((state) => state.events).slice(0, 5);
    const events_component = events.map((event) => {
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
    const contacts = Object.values(Contact.contact_dict).slice(0, 12);
    const contacts_component = contacts.map((contact) => (
        <DetailedContactStyle>
            <img className="person" src={contact.get_icon()} />
            <span className="name">{contact.get_name()} </span>
            <img className="icon" src="button_icons\task.svg" />
            <span>5</span>
            <img className="icon" src="button_icons\mail.svg" />
            <span>7</span>
        </DetailedContactStyle>
    ));

    return contacts_component;
}
