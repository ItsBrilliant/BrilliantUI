import React from "react";
import { Router, Switch, Route, Link, Redirect } from "react-router-dom";
import Mail from "./mail/Mail.js";
import "./Home.css";
import { ExpandEvents, ResetEvents } from "../actions/events";
import {
  get_all_mail,
  get_calendar,
  get_mail_folders,
  refresh_mail,
  refresh_calendar,
} from "../backend/Connect.js";
import { Calendar } from "./calendar/Calendar.js";
import {
  create_calendar_events,
  add_meetings_from_tasks,
} from "./calendar/utils";
import { EmailComposers } from "./EmailComposer.js";
import { Create } from "../actions/email_composer.js";
import { useDispatch } from "react-redux";
import { LoginPage } from "./LoginPage.js";
import { connect } from "react-redux";
import { Login } from "../actions/login.js";
import { Update, Delete } from "../actions/tasks.js";
import { ExpandThreads, ResetThreads } from "../actions/email_threads.js";
import { Contact } from "../data_objects/Contact.js";
import { ALL_FOLDERS_MAGIC, MAIL_FOLDERS } from "../data_objects/Consts.js";
import { Task } from "../data_objects/Task";
import axios from "axios";
import { Email } from "../data_objects/Email.js";
import Tasks from "../components/tasks/Tasks";
import { get_tasks_from_database } from "../backend/ConnectDatabase";
import { build_task_from_database } from "../backend/utils.js";
import BrilliantFeed from "../components/feed/BrilliantFeed";
import {Search} from './search/Search'

const history = require("history").createBrowserHistory();

export const SHOW_HTML = false;
const REFRESH_INTERVAL = 10000;

export class Home extends React.Component {
  constructor(props) {
    super(props);
    console.log("Started Home");
    this.set_threads = this.set_threads.bind(this);
    this.set_calendar = this.set_calendar.bind(this);
    this.set_mail_folders = this.set_mail_folders.bind(this);
    this.set_tasks = this.set_tasks.bind(this);
    this.refresh_user_data = this.refresh_user_data.bind(this);
    this.refresh_timer = null;
    this.loading = false;
    this.state = {
      taskEvents: [],
      mailFolders: Home.generate_empty_folders(),
    };
  }
  static generate_empty_folders() {
    var mailFolders = {};
    for (const folder of MAIL_FOLDERS) {
      mailFolders[folder] = null;
    }
    mailFolders["All"] = ALL_FOLDERS_MAGIC;
    return mailFolders;
  }
  componentDidMount() {
    axios.get("api/me").then((res) => this.handle_login(res.data));
  }
  componentWillUnmount() {
    clearInterval(this.refresh_timer);
  }

  handle_login(user_address) {
    console.log("new user address " + user_address);
    const new_user = this.change_user(user_address);
    this.props.Reset();
    this.props.ResetEvents();
    this.setState({
      mailFolders: Home.generate_empty_folders(),
    });
    this.load_user_data(new_user);
  }

  load_user_data(user) {
    if (this.loading) {
      return;
    }
    this.loading = true;
    clearInterval(this.refresh_timer);
    if (user.get_address()) {
      console.log("loading user data");
      console.log("getting calendar");
      Promise.all([
        get_mail_folders(this.set_mail_folders),
        get_calendar(this.set_calendar),
        get_tasks_from_database(user.get_address(), this.set_tasks).then((x) =>
          get_all_mail(this.set_threads)
        ),
      ]).then((arr) => (this.loading = false));
      this.refresh_timer = setInterval(
        this.refresh_user_data,
        REFRESH_INTERVAL
      );
    }
  }
  change_user(new_addresss) {
    Contact.clear_contacts();
    const new_user = Contact.create_contact_from_address(new_addresss);
    this.props.Login(new_user);
    return new_user;
  }
  set_mail_folders(folders) {
    const update_function = (folders) => {
      var my_folders = {};
      for (const folder of folders) {
        if (MAIL_FOLDERS.includes(folder["displayName"])) {
          my_folders[folder["displayName"]] = folder["id"];
        }
      }
      my_folders["All"] = ALL_FOLDERS_MAGIC;
      Email.FOLDER_MAPPINGS = my_folders;
      return my_folders;
    };
    this.update_user_data(folders, "mailFolders", update_function);
  }

  refresh_user_data() {
    const now = new Date().valueOf();
    get_tasks_from_database(
      this.props.user.get_address(),
      this.set_tasks,
      now - Math.round(1.5 * REFRESH_INTERVAL)
    ).then((x) => refresh_mail(this.set_threads));
    refresh_calendar(this.set_calendar);

    this.setState((state, props) => {
      const task_meetings = add_meetings_from_tasks(props.tasks, [
        ...props.calendarEvents,
        ...state.taskEvents,
      ]);
      console.log("Adding " + task_meetings.length + " task meetings");
      return { taskEvents: [...state.taskEvents, ...task_meetings] };
    });
  }

  update_user_data(data, update_field, update_function) {
    const new_state = {};
    new_state[update_field] = update_function(data);
    this.setState(new_state);
  }

  set_tasks(database_tasks) {
    const deleted_task_ids = database_tasks
      .filter(([task, is_deleted]) => is_deleted)
      .map(([task, is_deleted]) => task.id);
    if (deleted_task_ids.length > 0) {
      this.props.Delete(deleted_task_ids);
    }
    const tasks = database_tasks
      .filter(([task, is_deleted]) => !is_deleted)
      .map(([db_task, is_deleted]) => build_task_from_database(db_task));
    if (tasks.length > 0) {
      this.props.Update(tasks);
    }
  }
  set_threads(emails) {
    this.props.Expand(emails);
    const task_emails = Object.values(Task.CURRENT_TASKS).map(
      (t) => t.email_id
    );
    // Add tasks from each email once, after that they will come from the database
    for (const email of emails.filter(
      (e) => !task_emails.includes(e.get_id())
    )) {
      try {
        Task.add_request_meeting_task(this.props.Update, email);
        Task.add_general_task_detection(
          this.props.Update,
          email,
          "document_request"
        );
        Task.add_general_task_detection(
          this.props.Update,
          email,
          "task_detection"
        );
      } catch (e) {
        console.log("Error in task processing: " + e);
      }
    }
  }

  set_calendar(events) {
    this.props.ExpandEvents(events);
  }

  render() {
    const user_address = this.props.user.get_address();
    return (
      <Router history={history} forceRefresh={true}>
        <div className="Home">
          <Nav />
          <div id="not_nav" className="not_nav">
            <div className="top_buttons">
              <Search/>
              <button className="filter_button">Filter</button>
            </div>
            <Switch>
              <Route
                path="/login"
                exact
                render={() => (
                  <LoginPage
                    user_address={user_address}
                    on_login={(new_user_address) =>
                      this.handle_login(new_user_address)
                    }
                  />
                )}
              ></Route>
              <Route
                path="/external_login"
                exact
                component={() => {
                  window.location.href = "api";
                  return null;
                }}
              />
              <Route
                path="/external_logout"
                exact
                component={() => {
                  window.location.href = "api/signout";
                  return null;
                }}
              />
              {user_address ? null : <Redirect to="/login" />}
              <Route
                path="/mail"
                exact
                render={() => (
                  <Mail
                    emailThreads={this.props.emailThreads}
                    load_threads_function={() =>
                      this.load_user_data(this.props.user)
                    }
                    user={this.props.user}
                    folders={this.state.mailFolders}
                  />
                )}
              ></Route>
              <Route
                path="/calendar"
                exact
                render={() => (
                  <Calendar
                    events={[
                      ...this.props.calendarEvents,
                      ...this.state.taskEvents,
                    ]}
                  />
                )}
              ></Route>
              <Route path="/tasks" exact render={() => <Tasks />}></Route>
              <Route
                path="/feed"
                exact
                render={() => <BrilliantFeed />}
              ></Route>
            </Switch>
          </div>
        </div>
        <EmailComposers />
      </Router>
    );
  }
}

function Nav() {
  const dispatch = useDispatch();
  const logo = { icon: "button_icons/logo.svg", link: "/" };
  const brilliant_mode = { icon: "button_icons/brilliant.svg", link: "/feed" };
  const accounts = { icon: "button_icons/accounts.svg", link: "/" };
  const mail = { icon: "button_icons/mail.svg", link: "/mail" };
  const layout = { icon: "button_icons/layout.svg", link: "/" };
  const calendar = { icon: "button_icons/calendar.svg", link: "/calendar" };
  const files = { icon: "button_icons/files.svg", link: "/" };
  const people = { icon: "button_icons/people.svg", link: "/" };
  const task = { icon: "button_icons/task.svg", link: "/tasks" };
  const user_account = { icon: "person_images/0.jpg", link: "/login" };
  mail.additional = (
    <div className="plus">
      <button onClick={() => dispatch(Create({ composer_type: "new" }))}>
        +
      </button>
    </div>
  );
  return (
    <div className="Nav">
      {NavCluster([logo])}
      {NavCluster([brilliant_mode])}
      {NavCluster([mail, task, calendar, people, files])}
      {NavCluster([layout, accounts])}
      {
        <Link className="last_nav_link" to={user_account.link}>
          <img src={user_account.icon} />
        </Link>
      }
    </div>
  );
}
//            <img className='nav_link' src={icon} />
function NavCluster(icon_links) {
  return (
    <div className="NavCluster">
      {icon_links.map((i_l) => (
        <div className="nav_link" key={i_l.icon}>
          <Link to={i_l.link}>
            <div></div>
          </Link>
          <img src={i_l.icon} />
          {i_l.additional}
        </div>
      ))}
    </div>
  );
}


const mapStateToProps = (state) => ({
  user: state.user,
  emailThreads: state.email_threads,
  tasks: Object.values(state.tasks),
  calendarEvents: state.events,
});

const mapDispatchToProps = {
  Login,
  Expand: ExpandThreads,
  Reset: ResetThreads,
  ExpandEvents,
  ResetEvents,
  Update,
  Delete,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
