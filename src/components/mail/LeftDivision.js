import { GroupedThreads } from './GroupedThreads.js';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import Menues from '../external/Menues';
import { group_by_function, get_sort_function_by_type, filter_by_property } from '../../utils.js';
import './LeftDivision.css';
import { TIME_KEY, PRIORITY_KEY, MAIL_FOLDERS, MAIL_FOLDERS_DISPLAY } from '../../data_objects/Consts.js';
import { Component } from 'react';
import { Thread } from '../../data_objects/Thread.js';



export class LeftDivision extends Component {
  constructor(props) {
    super(props);
    this.state = {
      group_type: PRIORITY_KEY,
      sort_type: TIME_KEY,
      incoming: "Incoming",
      selected_folder_id: null
    }
    this.handleGrouping = this.handleGrouping.bind(this);
    this.handleSorting = this.handleSorting.bind(this);
    this.handleIncoming = this.handleIncoming.bind(this);
    this.set_selected_folder_id = this.set_selected_folder_id.bind(this);
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
  set_selected_folder_id(id) {
    this.setState({ selected_folder_id: id });
  }

  render() {
    return (
      <div className="LeftDivision">
        <MailFolders folders={this.props.folders}
          on_select={this.set_selected_folder_id}
          selected_folder_id={this.state.selected_folder_id}
        />
        <Menues
          incoming_value={this.state.incoming}
          sort_value={this.state.sort_type}
          group_value={this.state.group_type}
          handle_grouping={this.handleGrouping}
          handle_sorting={this.handleSorting}
          handle_incoming={this.handleIncoming}

        />
        <div className='ScrollableThreadContainer' >
          {ScrollableThreadContainer(
            this.props.emailThreads,
            this.props.handle_select,
            this.props.selected_thread_id,
            this.props.load_threads_function,
            this.state.group_type,
            this.state.sort_type,
            this.state.incoming,
            this.props.user,
            this.state.selected_folder_id)}
        </div>
      </div>
    );
  }
}

function filter_threads(incoming, threads, user) {
  var property = {
    name: 'receivers',
    func: email => email.get_receivers()
  }
  if (incoming === 'Outgoing') {
    property = {
      name: 'sender',
      func: email => email.get_sender()
    }
  }
  var filter_function = Thread.get_filter_function(property.name, user);
  return filter_by_property(threads, property.func, filter_function);
}

function filter_mail_folders(thread, folder_id) {
  if (folder_id === null) {
    return true;
  }
  const emails = thread.get_emails();
  if (emails.length === 0) {
    return false;
  }
  return emails[0].get_folder_id() === folder_id;
}

function ScrollableThreadContainer(emailThreads, handle_select, selected_thread_id, load_func,
  group_type, sort_type, incoming, user, selected_folder_id) {
  const folder_threads = Object.values(emailThreads).filter(t => filter_mail_folders(t, selected_folder_id));
  const filtered_threads = filter_threads(incoming, folder_threads, user)
  var grouped_threads = group_by_function(filtered_threads, Thread.get_group_function(group_type));
  var sorted_group_keys = Object.keys(grouped_threads).sort(get_sort_function_by_type(group_type));
  for (let key of sorted_group_keys) {
    grouped_threads[key].sort(Thread.get_sort_function(sort_type));
  }
  var groupings = sorted_group_keys.map((key) =>
    <GroupedThreads
      emailThreads={grouped_threads[key]}
      group_key={key}
      group_key_type={group_type}
      selected_thread_id={selected_thread_id}
      handle_select={handle_select} />)

  return (
    <SimpleBar className='SimpleBar2'>
      <div>
        {groupings}
        <button className='load_more_button' onClick={load_func}>Load more</button>
      </div>
    </SimpleBar>
  );
}

function MailFolders(props) {
  const relevant_folder_names = MAIL_FOLDERS.filter(folder => Object.keys(props.folders).includes(folder));
  const folder_buttons = relevant_folder_names.map(name => {
    const folder_id = props.folders[name]
    const style = props.selected_folder_id === folder_id && folder_id ? "selected" : "";
    console.log(style);
    return (
      <button className={style} value={folder_id} onClick={(e) => props.on_select(e.target.value)}>
        {MAIL_FOLDERS_DISPLAY[MAIL_FOLDERS.indexOf(name)]}
      </button>);
  }
  );
  return (
    <div className="MailFolders">
      {folder_buttons}
    </div>
  )
}


