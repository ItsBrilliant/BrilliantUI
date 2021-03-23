import React from "react";
import { useThreads } from "../../hooks/redux";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { SelectThread } from "../../actions/email_threads";
import { URGENT, ALL_FOLDERS_MAGIC } from "../../data_objects/Consts";
import EmailThread from "../mail/EmailThread";
import FeedComponent from "../feed/FeedComponent";
import FeedElement from "./FeedElement";
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
