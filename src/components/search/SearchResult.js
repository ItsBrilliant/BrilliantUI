import React, { useState } from "react";
import FilePreview from "react-preview-file";
import { SearchResultStyle } from "./Search.style";
import { useEmails, useTasks } from "../../hooks/redux";
import { email_container_background } from "../StyleConsts";
import { useDispatch, useSelector } from "react-redux";
import { format_date } from "../../utils";
import { useHistory } from "react-router";
import { SelectThread } from "../../actions/email_threads";
import { render_search_text } from "./utils";

export function SearchResults(props) {
  if (props.search_value.length < 2) {
    return null;
  }
  let filtered = props.data.filter((item) =>
    props.filter_function(item, props.search_value)
  );
  if (props.max_results) {
    filtered = filtered.slice(0, props.max_results);
  }
  const results = filtered.map((item) => (
    <SearchResultStyle onClick={() => props.my_on_click(item)}>
      <img src={props.icon} />
      <span>
        {render_search_text(props.top_line(item), props.search_value)}
        <p>{props.bottom_line(item)}</p>
      </span>
      <span className="timestamp">{props.time_stamp(item)}</span>
    </SearchResultStyle>
  ));
  return results;
}

export function SearchConversations(props) {
  const emails = useEmails();
  const history = useHistory();
  const dispatch = useDispatch();
  const filter_function = (email, value) =>
    email.get_subject().toLowerCase().includes(value.toLowerCase());
  const select_email = (email) => {
    let id = email.get_thread_id();
    dispatch(SelectThread(id));
    history.push("mail");
  };
  return (
    <SearchResults
      filter_function={filter_function}
      data={emails}
      top_line={(email) => email.get_subject()}
      bottom_line={(email) =>
        email.get_sender() ? email.get_sender().get_address() : ""
      }
      search_value={props.search_value}
      icon={"button_icons/mail.svg"}
      max_results={10}
      time_stamp={(email) => {
        let timestamp = format_date(email.get_date());
        return timestamp.date + " " + timestamp.time;
      }}
      my_on_click={select_email}
    ></SearchResults>
  );
}

export function SearchEvents(props) {
  const events = useSelector((state) => state.events);
  const filter_function = (event, value) =>
    event.subject.toLowerCase().includes(value.toLowerCase());
  const event_time_stamp = (event) => {
    let start = format_date(event.start);
    let end = format_date(event.end);
    return `${start.date} ${start.time} - ${end.time}`;
  };
  return (
    <SearchResults
      filter_function={filter_function}
      data={events}
      top_line={(event) => event.subject}
      bottom_line={(event) =>
        event.orginizer ? event.orginizer.get_address() : ""
      }
      search_value={props.search_value}
      icon={"button_icons/calendar.svg"}
      max_results={5}
      time_stamp={event_time_stamp}
    ></SearchResults>
  );
}

export function SearchTasks(props) {
  const tasks = useTasks("status", "Done", (a, b) => a !== b);
  const filter_function = (task, value) =>
    task.text.toLowerCase().includes(value.toLowerCase());
  return (
    <SearchResults
      filter_function={filter_function}
      data={tasks}
      top_line={(task) => task.text}
      bottom_line={(task) => task.owner.get_name()}
      search_value={props.search_value}
      icon={"button_icons/task.svg"}
      max_results={5}
      time_stamp={(task) => {
        let timestamp = format_date(task.deadline);
        return timestamp.date + " " + timestamp.time;
      }}
    ></SearchResults>
  );
}
