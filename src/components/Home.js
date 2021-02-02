import React from 'react';
import { Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import { Mail } from './mail/Mail.js'
import './Home.css';
import { get_all_mail, get_calendar, get_mail_folders } from '../backend/Connect.js';
import { Calendar } from './calendar/Calendar.js';
import { create_calendar_events } from '../utils.js';
import { EmailComposers } from './EmailComposer.js';
import { Create } from '../actions/email_composer.js';
import { useDispatch } from 'react-redux';
import { LoginPage } from './LoginPage.js';
import { connect } from "react-redux";
import { Login } from "../actions/login.js";
import { Update } from "../actions/tasks.js";
import { Expand, Reset } from "../actions/email_threads.js";
import { Contact } from '../data_objects/Contact.js';
import { MAIL_FOLDERS } from '../data_objects/Consts.js';
import { Task } from '../data_objects/Task'
import axios from 'axios';

const history = require("history").createBrowserHistory();

export const SHOW_HTML = false;

export class Home extends React.Component {
    constructor(props) {
        super(props);
        console.log("Started Home");
        this.update_search_bar = this.update_search_bar.bind(this);
        this.get_mailboxes = this.get_mailboxes.bind(this)
        this.state = {
            calendarEvents: [],
            search: "",
            mailFolders: Home.generate_empty_folders()
        };
    }
    static generate_empty_folders() {
        var mailFolders = {}
        for (const folder of MAIL_FOLDERS) {
            mailFolders[folder] = null;
        }
        return mailFolders;
    }
    update_search_bar(value) {
        this.setState({ search: value });
    }
    componentDidMount() {
        axios.get('api/me').then(res =>
            this.handle_login(res.data)
        );
    }

    handle_login(user_address) {
        console.log("new user address" + user_address);
        const new_user = this.change_user(user_address);
        this.props.Reset()
        this.setState({
            calendarEvents: [],
            mailFolders: Home.generate_empty_folders()
        });
        this.load_user_data(new_user)
    }

    async get_mailboxes(user) {
        console.log("getting all mail")
        await get_all_mail((emails, initial_user) => this.set_threads(emails, initial_user), user);
        //const emails =
        //      append_email_attachments(emails, user)
    }


    load_user_data(user) {
        if (user.get_address()) {
            console.log("loading user data")
            console.log("getting calendar")
            get_calendar((events, initial_user) => this.set_calendar(events, initial_user), user);
            get_mail_folders((folders, initial_user) => this.set_mail_folders(folders, initial_user), user);
            this.get_mailboxes(user);
        }
    }
    change_user(new_addresss) {
        Contact.clear_contacts();
        const new_user = Contact.create_contact_from_address(new_addresss);
        this.props.Login(new_user);
        return new_user
    }
    set_mail_folders(folders, initial_user) {
        const update_function = (folders) => {
            var my_folders = {}
            for (const folder of folders) {
                if (MAIL_FOLDERS.includes(folder['displayName'])) {
                    my_folders[folder['displayName']] = folder['id'];
                }
            }
            return my_folders;
        }
        this.update_user_data(folders, initial_user, 'mailFolders', update_function);
    }

    update_user_data(data, user, update_field, update_function) {
        var same_user = false;
        this.setState(
            function (state, props) {
                if (props.user.equals(user)) {
                    same_user = true;
                    const new_state = {}
                    new_state[update_field] = update_function(data);
                    return new_state;
                }
                else {
                    return {};
                }
            })
        console.log(update_field + ": same user is " + same_user);
        return same_user;
    }

    set_threads(emails, user) {
        var same_user = false;
        if (this.props.user.equals(user)) {
            this.props.Expand(emails)
            for (const email of emails) {
                Task.add_general_task_detection(this.props.Update, email);
            }
            same_user = true;
        } else {
            this.props.Reset()
        }
        console.log("set_threads: same user is " + same_user);
        return same_user;
    }

    set_calendar(events, initial_user) {
        const update_function = function (events) { return create_calendar_events(events) }
        this.update_user_data(events, initial_user, 'calendarEvents', update_function);
    }


    render() {
        const user_address = this.props.user.get_address();
        return (
            <Router history={history} forceRefresh={true}>
                <div className='Home'>
                    <Nav />
                    <div id="not_nav" className='not_nav'>
                        <div className='top_buttons'>
                            {SearchBar(this.state.search, this.update_search_bar)}
                            <button className='filter_button'>Filter</button>
                        </div>
                        <Switch>
                            <Route
                                path='/login' exact
                                render={() =>
                                    <LoginPage user_address={user_address} on_login={(new_user_address) => this.handle_login(new_user_address)} />}>
                            </Route>
                            <Route path='/external_login' exact component={() => {
                                window.location.href = 'api';
                                return null;
                            }} />
                            <Route path='/external_logout' exact component={() => {
                                window.location.href = 'api/signout';
                                return null;
                            }} />
                            {user_address ? null : <Redirect to='/login' />}
                            <Route
                                path='/mail' exact
                                render={() =>
                                    <Mail emailThreads={this.props.emailThreads}
                                        load_threads_function={() => this.get_mailboxes(this.props.user)}
                                        user={this.props.user}
                                        folders={this.state.mailFolders}
                                    />}>
                            </Route>
                            <Route
                                path='/calendar' exact
                                render={() =>
                                    <Calendar events={this.state.calendarEvents} />}>
                            </Route>
                            <Route
                                path='/build' exact
                                render={() => <h1>Build</h1>}
                            >
                            </Route>
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
    const logo = { icon: "button_icons/logo.svg", link: '/' }
    const brilliant_mode = { icon: "button_icons/brilliant.svg", link: '/build' }
    const accounts = { icon: "button_icons/accounts.svg", link: '/' }
    const mail = { icon: "button_icons/mail.svg", link: '/mail' }
    const layout = { icon: "button_icons/layout.svg", link: '/' }
    const calendar = { icon: "button_icons/calendar.svg", link: '/calendar' }
    const files = { icon: "button_icons/files.svg", link: '/' }
    const people = { icon: "button_icons/people.svg", link: '/' }
    const task = { icon: "button_icons/task.svg", link: '/' }
    const user_account = { icon: "person_images/0.jpg", link: '/login' }
    mail.additional = <div className="plus"><button onClick={() => dispatch(Create({ composer_type: "new" }))}>+</button></div>
    return (
        <div className='Nav'>
            {NavCluster([logo])}
            {NavCluster([brilliant_mode])}
            {NavCluster([mail, task, calendar, people, files])}
            {NavCluster([layout, accounts])}
            {<Link className='last_nav_link' to={user_account.link}>
                <img src={user_account.icon} />
            </Link>}
        </div>
    );
}
//            <img className='nav_link' src={icon} />
function NavCluster(icon_links) {
    return (
        <div className='NavCluster'>
            {icon_links.map(i_l =>
                <div className='nav_link'>
                    <Link to={i_l.link}>
                        <div></div>
                    </Link>
                    <img src={i_l.icon} />
                    {i_l.additional}
                </div>
            )}
        </div>
    )
}


const SearchBar = (keyword, setKeyword) => {
    return (
        <div className="SearchBar">
            <img src='button_icons/search.png'></img>
            <input
                key="search_bar"
                value={keyword}
                placeholder={"search"}
                onChange={(e) => setKeyword(e.target.value)}
            />
        </div>
    );
}

const mapStateToProps = state => ({
    user: state.user,
    emailThreads: state.email_threads
});

const mapDispatchToProps = {
    Login,
    Expand,
    Reset,
    Update
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
