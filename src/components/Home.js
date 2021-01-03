import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Mail } from './mail/Mail.js'
import './Home.css';
import { get_calendar, get_mailbox } from '../backend/Connect.js';
import { expand_threads } from '../data_objects/Thread.js';
import { Calendar } from './calendar/Calendar.js';
import { create_calendar_events } from '../utils.js';
import { EmailComposers } from './EmailComposer.js';
import { Create } from '../actions/email_composer.js';
import { useDispatch } from 'react-redux';

export const SHOW_HTML = true;

export class Home extends React.Component {
    constructor(props) {
        super(props);
        console.log("Started Home");
        this.update_search_bar = this.update_search_bar.bind(this);
        this.get_mailboxes = this.get_mailboxes.bind(this)
        this.state = {
            emailThreads: {},
            calendarEvents: [],
            search: ""
        };
    }
    update_search_bar(value) {
        this.setState({ search: value });
    }

    get_mailboxes() {
        get_mailbox((emails) => this.set_threads(emails), '/inbox_react');
        get_mailbox((emails) => this.set_threads(emails), '/get_sent_react');
    }
    componentDidMount() {
        get_calendar((events) => this.set_calendar(events));
        this.get_mailboxes();
    }
    set_threads(emails) {
        this.setState({ emailThreads: expand_threads(emails) });
        //  this.setState({ selected_thread_id: Object.keys(this.emailThreads)[0] });
    }
    set_calendar(events) {
        this.setState({ calendarEvents: create_calendar_events(events) });
    }
    render() {
        return (
            <Router>
                <div className='Home'>
                    <Nav />
                    <div id="not_nav" className='not_nav'>
                        <div className='top_buttons'>
                            {SearchBar(this.state.search, this.update_search_bar)}
                            <button className='filter_button'>Filter</button>
                        </div>
                        <Switch>
                            <Route
                                path='/mail' exact
                                render={() =>
                                    <Mail emailThreads={this.state.emailThreads}
                                        load_threads_function={this.get_mailboxes}
                                    />}>
                            </Route>
                            <Route
                                path='/calendar' exact
                                render={() =>
                                    <Calendar events={this.state.calendarEvents} />}>
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
    const brilliant_mode = { icon: "button_icons/brilliant.svg", link: '/compose' }
    const accounts = { icon: "button_icons/accounts.svg", link: '/' }
    const mail = { icon: "button_icons/mail.svg", link: '/mail' }
    const layout = { icon: "button_icons/layout.svg", link: '/' }
    const calendar = { icon: "button_icons/calendar.svg", link: '/calendar' }
    const files = { icon: "button_icons/files.svg", link: '/' }
    const people = { icon: "button_icons/people.svg", link: '/' }
    const task = { icon: "button_icons/task.svg", link: '/' }
    const user_account = { icon: "person_images/0.jpg", link: '/' }

    mail.additional = <div className="plus"><button onClick={() => dispatch(Create())}>+</button></div>
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

