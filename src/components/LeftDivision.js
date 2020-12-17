import { GroupedThreads } from './GroupedThreads.js';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import Menues from './Menues';
import { group_by_function, get_sort_function_by_type, filter_by_property } from '../utils.js';
import './LeftDivision.css';
import { Thread, TIME_KEY, PRIORITY_KEY } from '../data_objects/EmailObjects.js';
import { Component } from 'react';
import { person0 } from './Main.js';


export class LeftDivision extends Component {
  constructor(props) {
    super(props);
    this.state = {
      group_type: PRIORITY_KEY,
      sort_type: TIME_KEY,
      incoming: "Incoming"
    }
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
            this.state.incoming)}
        </div>
      </div>
    );
  }
}

function filter_threads(incoming, threads) {
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
  var filter_function = Thread.get_filter_function(property.name, person0);
  return filter_by_property(Object.values(threads), property.func, filter_function);
}

function ScrollableThreadContainer(emailThreads, handle_select, selected_thread_id, load_func,
  group_type, sort_type, incoming) {
  const filtered_threads = filter_threads(incoming, emailThreads)
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

function load_more() {
  console.log("load_more_button clicked");
}
