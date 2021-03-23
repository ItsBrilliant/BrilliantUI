import { update_draft } from "./Connect.js";
import { Contact } from "../data_objects/Contact";
import { Task } from "../data_objects/Task";

export function mark_read(email_id, is_read) {
  const email = {
    message: { isRead: is_read },
  };
  console.log("marking email read");
  update_draft(email_id, email)
    .then((res) => console.log(res))
    .catch((err) => console.log(`error trying to mark email read: ${err}`));
}

export function update_resource_version(resource, database) {
  const current_version = database[resource.id];
  if (resource.changeKey === current_version) {
    return false;
  } else {
    database[resource.id] = resource.changeKey;
    return true;
  }
}

export function build_task_from_database(db_task) {
  let task = new Task(
    db_task.text,
    db_task.deadline,
    db_task.priority,
    db_task.source_indexes,
    undefined,
    db_task.id,
    undefined
  );
  for (const field in db_task) {
    const converted_value = convert_from_database_value(field, db_task[field]);
    if (converted_value !== undefined) {
      task[field] = converted_value;
    }
  }
  return task;
}

export function convert_from_database_value(field, value) {
  if (field === "watchers") {
    return value.map((w) => Contact.create_contact_from_address(w));
  } else if (["initiator", "owner"].includes(field)) {
    return Contact.create_contact_from_address(value);
  } else if (field === "deadline") {
    // deadline is already converted in the constructor
    return undefined;
  } else if (field === "meeting") {
    let local_times = value.times.map((t) => new Date(t));
    return { duration: value.duration, times: local_times };
  }
  return value;
}

export function build_task_for_database(task) {
  var db_task = {};
  for (const field in task) {
    db_task[field] = convert_to_database_value(field, task[field]);
  }
  let all_watchers = new Set(db_task.watchers);
  all_watchers.add(db_task.initiator);
  all_watchers.add(db_task.owner);
  return [db_task, Array.from(all_watchers)];
}

export function general_axios_call(func, context) {
  console.log(context);
  try {
    const res = func();
    console.log(res);
    return res;
  } catch (e) {
    console.log(e);
  }
}

export function convert_to_database_value(field, value) {
  if (field === "watchers") {
    return value.map((contact) => contact.get_address());
  } else if (["initiator", "owner"].includes(field)) {
    return value.get_address();
  }
  return value;
}
