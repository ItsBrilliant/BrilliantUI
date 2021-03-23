import { OneDriveLargeFileUploadTask } from "@microsoft/microsoft-graph-client";
import { Thread } from "../data_objects/Thread.js";
export const EmailThreadsReducer = (state = {}, action) => {
  if (action.type === "EXPAND_THREADS") {
    var new_state = Object.assign({}, state);
    for (const email of action.emails) {
      const thread_id = email.get_thread_id();
      if (new_state[thread_id] === undefined) {
        new_state[thread_id] = new Thread(thread_id, []);
      }
      new_state[thread_id].add_email(email);
    }
    return new_state;
  } else if (action.type === "DELETE_THREAD") {
    var new_state = {};
    for (const thread_id of Object.keys(state).filter(
      (id) => id !== action.id
    )) {
      new_state[thread_id] = state[thread_id];
    }
    return new_state;
  } else if (action.type === "DELETE_EMAILS") {
    const current_emails_dict = state[action.thread_id].emails_dict;
    const current_email_ids = Object.keys(current_emails_dict);
    var new_state = Object.assign({}, state);
    const wanted_email_ids = current_email_ids.filter(
      (i) => !action.email_ids.includes(i)
    );
    if (wanted_email_ids.length === 0) {
      delete new_state[action.thread_id];
    } else {
      new_state[action.thread_id] = new Thread(
        action.thread_id,
        wanted_email_ids.map((i) => current_emails_dict[i])
      );
    }
    return new_state;
  } else if (action.type === "RESET_THREADS") {
    return {};
  } else {
    return state;
  }
};

export const SelectedThreadReducer = (state = null, action) => {
  let new_state = state;
  if (action.type === "SELECT_THREAD") {
    new_state = action.id;
  }
  return new_state;
};
