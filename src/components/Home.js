import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Main } from './Main.js'
import './Home.css';
import { get_mailbox } from '../data_objects/Connect.js';
import { create_threads } from '../data_objects/Thread.js';

export class Home extends React.Component {
    constructor(props) {
        super(props);
        console.log("Started Home");
        this.state = {
            emailThreads: {}
        };
    }
    componentDidMount() {
        get_mailbox((emails) => this.set_threads(emails));
    }
    set_threads(emails) {
        this.setState({ emailThreads: create_threads(emails) });
        //  this.setState({ selected_thread_id: Object.keys(this.emailThreads)[0] });
    }
    render() {
        return (
            <Router>
                <div className='Home'>
                    <Nav />
                    <Switch>
                        <Route
                            path='/mail' exact
                            render={() =>
                                <Main emailThreads={this.state.emailThreads}
                                    load_threads_function={() => get_mailbox((emails) => this.set_threads(emails))}
                                />
                            }>
                        </Route>
                    </Switch>
                </div>
            </Router>
        );
    }
}

function Nav() {
    const accounts = { icon: "button_icons/accounts.svg", link: '/' }
    const mail = { icon: "button_icons/mail.svg", link: '/mail' }
    const layout = { icon: "button_icons/layout.svg", link: '/' }
    const calendar = { icon: "button_icons/calendar.svg", link: '/calendar' }
    const files = { icon: "button_icons/files.svg", link: '/' }
    const people = { icon: "button_icons/people.svg", link: '/' }
    const task = { icon: "button_icons/task.svg", link: '/' }
    return (
        <div className='Nav'>
            {NavCluster([mail])}
            {NavCluster([task])}
            {NavCluster([mail, task, calendar, people, files])}
            {NavCluster([layout, accounts])}
        </div>
    );
}
//            <img className='nav_link' src={icon} />
function NavCluster(icon_links) {
    return (
        <div className='NavCluster'>
            {icon_links.map(i_l => <Link className='nav_link' to={i_l.link}>
                <img src={i_l.icon} />
            </Link>)}
        </div>
    )
}

