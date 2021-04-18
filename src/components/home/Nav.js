import React from 'react';
import { useDispatch } from 'react-redux';
import { Create } from '../../actions/email_composer';
import { Link } from 'react-router-dom';
import './Nav.css';

export default function Nav() {
    const dispatch = useDispatch();
    const logo = { icon: 'button_icons/logo.svg', link: '/' };
    const brilliant_mode = {
        icon: 'button_icons/brilliant.svg',
        link: '/feed',
    };
    const accounts = { icon: 'button_icons/accounts.svg', link: '/' };
    const mail = { icon: 'button_icons/mail.svg', link: '/mail' };
    const layout = { icon: 'button_icons/layout.svg', link: '/' };
    const calendar = { icon: 'button_icons/calendar.svg', link: '/calendar' };
    const files = { icon: 'button_icons/files.svg', link: '/search' };
    const people = { icon: 'button_icons/people.svg', link: '/' };
    const task = { icon: 'button_icons/task.svg', link: '/tasks' };
    const user_account = { icon: 'person_images/0.jpg', link: '/login' };
    mail.additional = (
        <div className="plus">
            <button onClick={() => dispatch(Create({ composer_type: 'new' }))}>
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
