import { GroupedThreads } from "./GroupedThreads.js";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import Menues from "../external/Menues";
import {
  group_by_function,
  get_sort_function_by_type,
  filter_by_property,
} from "../../utils.js";
import "./LeftDivision.css";
import {
  TIME_KEY,
  PRIORITY_KEY,
  MAIL_FOLDERS,
  MAIL_FOLDERS_DISPLAY,
  ALL_FOLDERS_MAGIC,
} from "../../data_objects/Consts.js";
import { Component } from "react";
import { Thread } from "../../data_objects/Thread.js";
import { useSelector } from "react-redux";

export class LeftDivision extends Component {
  constructor(props) {
    super(props);
    this.state = {
      group_type: PRIORITY_KEY,
      sort_type: TIME_KEY,
      incoming: "Incoming",
    };
    this.handleGrouping = this.handleGrouping.bind(this);
    this.handleSorting = this.handleSorting.bind(this);
    this.handleIncoming = this.handleIncoming.bind(this);
  }

  handleGrouping(selected) {
    this.setState({ group_type: selected.value });
  }
  handleSorting(selected) {
    this.setState({ sort_type: selected.value });
  }
  handleIncoming(selected) {
    this.setState({ incoming: selected.value });
  }

  render() {
    return (
      <div className="LeftDivision">
        <MailFolders
          folders={this.props.folders}
          on_select={this.props.set_selected_folder}
          selected_folder={this.props.selected_folder}
        />
        <Menues
          incoming_value={this.state.incoming}
          sort_value={this.state.sort_type}
          group_value={this.state.group_type}
          handle_grouping={this.handleGrouping}
          handle_sorting={this.handleSorting}
          handle_incoming={this.handleIncoming}
        />
        <div className="ScrollableThreadContainer">
          <ScrollableThreadContainer
            emailThreads={this.props.emailThreads}
            handle_select={this.props.handle_select}
            selected_thread_id={this.props.selected_thread_id}
            load_func={this.props.load_threads_function}
            group_type={this.state.group_type}
            sort_type={this.state.sort_type}
            incoming={this.state.incoming}
            user={this.props.user}
            folders={this.props.folders}
            selected_folder={this.props.selected_folder}
          />
        </div>
      </div>
    );
  }
}

function filter_threads(incoming, threads, user) {
  var property = {
    name: "receivers",
    func: (email) => email.get_receivers(),
  };
  if (incoming === "Outgoing") {
    property = {
      name: "sender",
      func: (email) => email.get_sender(),
    };
  }
  var filter_function = Thread.get_filter_function(property.name, user);
  return filter_by_property(threads, property.func, filter_function);
}

function filter_mail_folders(thread, folder_id) {
  const emails = thread.get_emails();
  if (emails.length === 0) {
    return false;
  }
  if (folder_id === ALL_FOLDERS_MAGIC) {
    return true;
  }
  for (const email of emails) {
    if (email.get_folder_id() === folder_id) {
      return true;
    }
  }
  return false;
}

function ScrollableThreadContainer(props) {
  const tasks = useSelector((state) => Object.values(state.tasks));
  const selected_folder_id = props.folders[props.selected_folder];
  var filtered_threads = Object.values(props.emailThreads).filter((t) =>
    filter_mail_folders(t, selected_folder_id)
  );
  if (props.selected_folder !== "Drafts") {
    filtered_threads = filter_threads(
      props.incoming,
      filtered_threads,
      props.user
    );
  }
  var grouped_threads = group_by_function(
    filtered_threads,
    Thread.get_group_function(props.group_type)
  );
  var sorted_group_keys = Object.keys(grouped_threads).sort(
    get_sort_function_by_type(props.group_type)
  );
  for (let key of sorted_group_keys) {
    grouped_threads[key].sort(Thread.get_sort_function(props.sort_type));
  }
  var groupings = sorted_group_keys.map((key) => (
    <GroupedThreads
      key={key}
      emailThreads={grouped_threads[key]}
      group_key={key}
      group_key_type={props.group_type}
      selected_thread_id={props.selected_thread_id}
      handle_select={props.handle_select}
      tasks={tasks}
      selected_folder_id={selected_folder_id}
    />
  ));

  return (
    <SimpleBar className="SimpleBar2">
      <div>
        {groupings}
        <button className="load_more_button" onClick={props.load_func}>
          Load more
        </button>
      </div>
    </SimpleBar>
  );
}

function MailFolders(props) {
  const relevant_folder_names = MAIL_FOLDERS.filter((folder) =>
    Object.keys(props.folders).includes(folder)
  );
  const folder_buttons = relevant_folder_names.map((name) => {
    const style = props.selected_folder === name ? "selected" : "";
    return (
      <button
        key={name}
        className={style}
        value={name}
        onClick={(e) => props.on_select(e.target.value)}
      >
        {MAIL_FOLDERS_DISPLAY[MAIL_FOLDERS.indexOf(name)]}
      </button>
    );
  });
  return <div className="MailFolders">{folder_buttons}</div>;
}
