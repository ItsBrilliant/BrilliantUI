import React, { useState } from "react";
import { useTasks, useThreads, useEmails } from "../../hooks/redux";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { SelectThread } from "../../actions/email_threads";
import { URGENT, ALL_FOLDERS_MAGIC } from "../../data_objects/Consts";
import EmailThread from "../mail/EmailThread";
import FeedComponent from "../feed/FeedComponent";
import FeedElement from "./FeedElement";
import { format_date, is_same_day } from "../../utils";
import { CalendarTask } from "../calendar/CalendarTasks";
import EmailContainer from "../mail/EmailContainer";

const NOW = new Date("2021-03-24T10:00:00");

export function UrgentEmails(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  let threads = useThreads(URGENT);
  const count = props.max_threads ? props.max_threads : 3;
  threads = threads.slice(0, count);
  const my_handle_select = (id) => {
    dispatch(SelectThread(id));
    history.push("mail");
  };
  const thread_components = threads.map((thread) => (
    <EmailThread
      key={thread.id}
      id={thread.id}
      thread={thread}
      is_selected={false}
      handle_select={my_handle_select}
      priority={URGENT}
      options_offset={{ top: 0, left: 15 }}
    />
  ));
  const component = (
    <FeedComponent
      buttons={[]}
      component={<div className="UrgentEmails">{thread_components}</div>}
    />
  );

  return (
    <FeedElement
      title="Catch up on some urgent emails"
      time="11:00"
      component={component}
    />
  );
}

export function NextMeeting(props) {
  let events = useSelector((state) => state.events);
  events = events.filter(
    (t) => t.start > NOW && t.start.getDate() === NOW.getDate()
  );
  if (events.length === 0) {
    return null;
  }
  const next_event = events.sort((a, b) => a.start - b.start)[0];
  const start_time = format_date(next_event.start).time;

  const meeting_component = (
    <div>
      <h4>{next_event.subject}</h4>
      <p>{next_event.description}</p>
    </div>
  );
  const buttons = [
    "Edit Agenda",
    "Send Reminder",
    "Reschedule",
    "Enter Call",
  ].map((b) => {
    return { name: b, action: () => {} };
  });
  const component = (
    <FeedComponent
      buttons={buttons}
      component={<div className="NextMeeting">{meeting_component}</div>}
    />
  );

  return (
    <FeedElement
      title="Your next Meeting"
      time={start_time}
      component={component}
    />
  );
}

export function OverdueTasks(props) {
  let tasks = useTasks("deadline", NOW, (a, b) => is_same_day(a, b));
  tasks = tasks.sort((a, b) => a.priority - b.priority);
  const tasks_component = tasks.map((t) => (
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
  const buttons = [
    "Change Priority",
    "Book Time",
    "Reassign",
    "Change Status",
  ].map((b) => {
    return { name: b, action: () => {} };
  });
  const component = (
    <FeedComponent
      buttons={buttons}
      component={<div className="OverdueTasks">{tasks_component}</div>}
    />
  );

  return (
    <FeedElement
      title="These tasks are due today"
      time={props.time}
      component={component}
    />
  );
}

export function UnfinishedDrafts(props) {
  const [index, set_index] = useState(0);
  let emails = useEmails();
  emails = emails.filter((e) => e.is_draft());
  const increment = (max) => {
    if (index < max) {
      set_index(index + 1);
    }
  };

  const decrement = () => {
    if (index > 0) {
      set_index(index - 1);
    }
  };
  if (emails.length === 0) {
    return null;
  }
  const email = emails[index];
  const buttons = [
    { name: "Back", action: decrement },
    { name: "Next", action: () => increment(emails.length - 1) },
  ];
  let indicators = [];
  for (let i = 0; i < emails.length; i++) {
    const style = index === i ? "selected" : null;
    indicators.push(<span className={style} />);
  }
  const drafts_component = (
    <>
      <EmailContainer key={email.get_id()} email={email} />
      <div className="indicators">{indicators}</div>
    </>
  );
  const component = (
    <FeedComponent
      buttons={buttons}
      component={<div className="UnfinishedDrafts">{drafts_component}</div>}
    />
  );

  return (
    <FeedElement
      title="You have unfinished drafts"
      time={props.time}
      component={component}
    />
  );
}
