import React, { useState } from "react";
import ReactDOM from "react-dom";
import SimpleBar from "simplebar-react";
import "./SingleTaskInfo.css";
import { AttachmentDisplay } from "../mail/FileAttachments.js";
import EmailThread from "../mail/EmailThread.js";
import { GroupIcon, EmailStamp } from "../mail/EmailStamp.js";
import { Menu } from "../external/Menues.js";
import OptionsButton from "../OptionsButton.js";
import PriorityOptions from "../PriorityOptions.js";
import { EmailComposer } from "../EmailComposer.js";
import { send_quick_reply } from "../email_compuser_utils.js";
import { useDispatch, useSelector } from "react-redux";
import { Update } from "../../actions/tasks";
import { Task } from "../../data_objects/Task";
import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";
import { GeneralPortal } from "../GeneralPortal";
import AddTag from "./AddTag";
import AddWatchers, { NameWithIcon } from "./AddWatchers.js";
import { Contact } from "../../data_objects/Contact";
import { SelectThread } from "../../actions/email_threads";
import { useHistory } from "react-router-dom";

function SingleTaskInfo(props) {
  const dispatch = useDispatch();
  const task_updater = (task) => dispatch(Update(task));
  const [details_view, set_details_view] = useState(true);
  const body = details_view ? (
    <TaskDetails {...props} updater={task_updater}></TaskDetails>
  ) : (
    <TaskConversation task={props.task} updater={task_updater} />
  );

  return (
    <div className="SingleTaskInfo">
      <div className="header">
        <TopButtons task={props.task} updater={task_updater} />
        <EditingTextArea
          handle_blur={(val) =>
            Task.update_task(task_updater, props.task, "text", val)
          }
          start_value={props.task.text}
        />
        <ViewSelector
          details_view={details_view}
          set_details_view={set_details_view}
        />
      </div>
      <div className="scrollable">
        <SimpleBar className="simplebar">{body}</SimpleBar>
      </div>
    </div>
  );
}

export default function TaskInfoWrapper(props) {
  const task = useSelector((state) => state.tasks[props.task_id]);
  const thread = useSelector((state) => state.email_threads[props.thread_id]);
  if (!props.task_id) {
    return null;
  }
  return ReactDOM.createPortal(
    <div className="TaskInfoWrapper">
      <div className="invisible_close" onClick={props.close} />
      <SingleTaskInfo task={task} thread={thread} {...props} />
    </div>,
    document.getElementById("messages_to_user")
  );
}

function TaskDetails(props) {
  const resources = props.thread ? props.thread.get_attachments() : [];
  return (
    <>
      <QuickReply
        to={props.task.initiator}
        email_id={props.task.email_id}
        on_close={props.close}
      />
      <Description task={props.task} updater={props.updater} />
      <People
        task={props.task}
        watchers={props.task.watchers}
        owner={props.task.get_owner()}
      />
      <RelevantResources resources={resources} />
      <SourceConversation thread={props.thread} />
    </>
  );
}

function TaskConversation(props) {
  const messages = props.task.messages.map((message) => {
    const sender = Contact.create_contact_from_address(message.sender_email);
    const own_message_style =
      message.sender_email === Contact.CURRENT_USER.get_address()
        ? " user"
        : "";
    return (
      <div className={"task_message" + own_message_style}>
        {EmailStamp([sender], message.timestamp)}
        <span>{message.body}</span>
      </div>
    );
  });
  return (
    <div className="TaskConversation">
      {messages}
      <EditingTextArea
        placeholder="new comment..."
        start_value=""
        handle_enter={(val) =>
          Task.update_task(props.updater, props.task, "add_message", [val])
        }
      />
    </div>
  );
}

function ViewSelector(props) {
  const selected_style = { color: "white" };
  const details_style = props.details_view ? selected_style : null;
  const conversation_style = !props.details_view ? selected_style : null;
  return (
    <div className="ViewSelector">
      <button
        style={details_style}
        onClick={() => props.set_details_view(true)}
      >
        Details
      </button>
      <button
        style={conversation_style}
        onClick={() => props.set_details_view(false)}
      >
        Conversation
      </button>
    </div>
  );
}

function TopButtons(props) {
  const [priority, setPriority] = useState(props.task.get_priority());
  const [task_status, setStatus] = useState(props.task.status);
  const option_button_names = [
    "Quick Reply",
    "Set In Calendar",
    "Add To Topic",
    "Go To Source",
    "Mark As Done",
  ];
  var options_buttons = option_button_names.map((n) => {
    return { name: n };
  });
  options_buttons.filter((n) => n.name === "Mark As Done")[0].action = (e) =>
    my_set_status("Done");
  const task_options = ["To do", "In progress", "Pending", "Done"];
  const my_set_status = (value) => {
    setStatus(value);
    Task.update_task(props.updater, props.task, "status", value);
  };
  const my_set_priority = (value) => {
    setPriority(value);
    Task.update_task(props.updater, props.task, "set_priority", [value]);
  };
  const my_set_deadline = (value) => {
    Task.update_task(props.updater, props.task, "deadline", value);
  };
  const my_set_tags = (tags) => {
    Task.update_task(props.updater, props.task, "tags", tags);
  };
  return (
    <div className="TopButtons">
      <div className="task_status">
        <Menu
          options={task_options}
          label=""
          value={task_status}
          onChange={(e) => my_set_status(e.value)}
        />
      </div>
      <OptionsButton options={options_buttons} offset={{ top: 0, left: 15 }} />
      <div className="task_priority">
        <PriorityOptions
          default_selection={priority}
          onChange={my_set_priority}
        />
      </div>
      <AddTag on_items_change={my_set_tags} task={props.task} />
      <DateTimePickerComponent
        format="dd/MM/yy hh:mm a"
        id="deadline"
        data-name="deadline"
        value={props.task.deadline}
        onChange={(e) => my_set_deadline(e.target.value)}
        className="task_deadline"
      />
    </div>
  );
}

function QuickReply(props) {
  const email_attributes = {
    email_id: props.email_id,
    composer_type: "quick_reply",
  };
  const quick_reply_component = (
    <EmailComposer
      only_content={true}
      id={-1}
      email_attributes={email_attributes}
      content_title={props.to.get_name()}
      send={send_quick_reply}
      on_close={props.on_close}
    />
  );
  return (
    <TitledComponent
      title="Quick Reply"
      component={quick_reply_component}
      class_name={"quick_reply"}
    />
  );
}

function People(props) {
  const dispatch = useDispatch();
  const task_updater = (task) => dispatch(Update(task));
  const [add_watchers_visible, set_visible] = useState(false);
  const [location, set_location] = useState({ x: 0, y: 0 });
  const open_portal = (e) => {
    set_location({ x: e.pageX - 200, y: e.pageY });
    set_visible(true);
  };
  const handle_add_watcher = (contact) => {
    set_visible(false);
    Task.update_task(task_updater, props.task, "add_watcher", [contact]);
  };
  const owner = (
    <span>
      {GroupIcon([props.owner], 1, 50)}
      <div>
        <p className="owner_name">{props.owner.get_name()}</p>
        <p>Owner</p>
      </div>
    </span>
  );

  const watchers = (
    <span>
      <div>
        <p> Watching</p>
      </div>
      {GroupIcon(props.watchers, 6, 30, 22)}
      <button onClick={open_portal} className="add_watchers">
        +
      </button>
      <GeneralPortal
        visible={add_watchers_visible}
        handle_close={() => set_visible(false)}
        component={
          <AddWatchers on_select={handle_add_watcher} location={location} />
        }
      />
    </span>
  );

  const people_componenet = (
    <div className="People">
      {owner}
      {watchers}
    </div>
  );
  return (
    <TitledComponent
      title="People"
      component={people_componenet}
      class_name="People"
    />
  );
}

function EditingTextArea(props) {
  const [text, set_text] = useState(props.start_value);
  const my_key_press = (e) => {
    if (e.key === "Enter" && props.handle_enter) {
      props.handle_enter(text);
      set_text("");
    }
  };
  return (
    <textarea
      className="EditingTextArea"
      value={text}
      onChange={(e) => set_text(e.target.value)}
      onBlur={() => props.handle_blur && props.handle_blur(text)}
      onKeyPress={my_key_press}
      placeholder={props.placeholder}
    />
  );
}

function Description(props) {
  const description_component = (
    <EditingTextArea
      start_value={props.task.description}
      handle_blur={(val) =>
        Task.update_task(props.updater, props.task, "description", val)
      }
    />
  );

  return (
    <TitledComponent
      title="Description"
      component={description_component}
      class_name="description"
    />
  );
}

function RelevantResources(props) {
  if (props.resources.length === 0) {
    return null;
  }
  const attachemnts_for_display = (
    <div className="RelevantResources">
      {props.resources.map((a) => (
        <AttachmentDisplay attachment={a} />
      ))}
    </div>
  );

  return (
    <TitledComponent
      title="Relevant Resources"
      component={attachemnts_for_display}
    />
  );
}

function SourceConversation(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const my_handle_select = (id) => {
    dispatch(SelectThread(id));
    history.push("mail");
  };
  const email_thread_component = props.thread ? (
    <EmailThread
      id={props.thread.id}
      thread={props.thread}
      is_selected={false}
      handle_select={my_handle_select}
      priority={null}
      options_offset={{ top: 0, left: -160 }}
    />
  ) : (
    <h2>Not Available</h2>
  );
  return (
    <TitledComponent
      title="Source Conversation"
      component={email_thread_component}
    />
  );
}

function TitledComponent(props) {
  let general_class_name = "general_component";
  if (props.class_name) {
    general_class_name += " " + props.class_name;
  }
  return (
    <div className="TitledComponent">
      <h4 className="title">{props.title}</h4>
      <div className={general_class_name}>{props.component}</div>
    </div>
  );
}
