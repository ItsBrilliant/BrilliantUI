import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
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
    const icon_link = { icon: "file_icons/attachment.png", link: '/mail' }
    const home_link = { icon: "file_icons/attachment.png", link: '/' }
    return (
        <div className='Nav'>
            {NavCluster([home_link])}
            {NavCluster([icon_link])}
            {NavCluster([icon_link, icon_link, icon_link, icon_link, icon_link])}
            {NavCluster([icon_link, icon_link])}
        </div>
    );
}
//            <img className='nav_link' src={icon} />
function NavCluster(icon_links) {
    return (
        <div className='NavCluster'>
            {icon_links.map(i_l => <Link to={i_l.link}>
                <img className='nav_link' src={i_l.icon} />
            </Link>)}
        </div>
    )
}

