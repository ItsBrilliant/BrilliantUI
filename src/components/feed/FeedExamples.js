import React, { useState } from "react";
import { useTasks, useThreads, useEmails } from "../../hooks/redux";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { SelectThread } from "../../actions/email_threads";
import {
  URGENT,
  ALL_FOLDERS_MAGIC,
  PRIORITIES,
} from "../../data_objects/Consts";
import EmailThread from "../mail/EmailThread";
import FeedComponent from "../feed/FeedComponent";
import FeedElement from "./FeedElement";
import { format_date, is_same_day } from "../../utils";
import { CalendarTask } from "../calendar/CalendarTasks";
import EmailContainer from "../mail/EmailContainer";
import { IncrementalStyle } from "./Feed.style";

const NOW = new Date("2021-03-24T10:00:00");

export function UrgentEmails(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  let threads = useThreads(props.priority);
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
      priority={props.priority}
      options_offset={{ top: 0, left: 15 }}
    />
  ));
  return (
    <FeedComponent
      buttons={[]}
      component={<div className="UrgentEmails">{thread_components}</div>}
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
  return (
    <FeedComponent
      buttons={buttons}
      component={<div className="NextMeeting">{meeting_component}</div>}
    />
  );
}

export function OverdueTasks(props) {
  let tasks = useTasks(
    ["deadline", "status"],
    [NOW, "Done"],
    [(a, b) => is_same_day(a, b), (a, b) => a !== b]
  );
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
  return (
    <FeedComponent
      buttons={buttons}
      component={<div className="OverdueTasks">{tasks_component}</div>}
    />
  );
}

export function UnfinishedDrafts(props) {
  let emails = useEmails();
  emails = emails.filter((e) => e.is_draft());
  const buttons = ["Continue", "Discard"].map((b) => {
    return { name: b, action: () => {} };
  });
  const pages = emails.map((email) => (
    <EmailContainer key={email.get_id()} email={email} />
  ));
  return (
    <FeedComponent
      buttons={buttons}
      component={
        <div className="UnfinishedDrafts">
          {<IncrementalFeedComponent pages={pages} />}
        </div>
      }
    />
  );
}

export function IncrementalFeedComponent(props) {
  const [index, set_index] = useState(0);
  const max = props.pages.length - 1;
  if (max === -1) {
    return null;
  }
  const increment = () => {
    if (index < max) {
      set_index(index + 1);
    }
  };

  const decrement = () => {
    if (index > 0) {
      set_index(index - 1);
    }
  };

  const current_page = props.pages[index];
  let indicators = [];
  for (let i = 0; i < props.pages.length; i++) {
    const style = index === i ? "selected" : null;
    indicators.push(<span className={style} />);
  }

  return (
    <IncrementalStyle>
      {current_page}
      <div className="indicators">
        <button onClick={decrement}>{"<"}</button>
        {indicators}
        <button onClick={increment}>{">"}</button>
      </div>
    </IncrementalStyle>
  );
}
