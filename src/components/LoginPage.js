import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import './LoginPage.css';

export function LoginPage(props) {
    const [user, setUser] = useState(props.user_address);
    const history = useHistory();
    const handle_click = (user) => {
        props.on_login(user);
        history.push('/');
    }

    return (
        <div className="LoginPage">
            <h3>Login</h3>
            <label for="user_email"> Email: </label>
            <input id='user_email' value={user}
                onChange={(e) => setUser(e.target.value)}></input>
            <div className="login_page_buttons">
                <button className="in" onClick={() => handle_click(user)}>Log in</button>
                <button className="out" onClick={() => handle_click("")}>Log out</button>
            </div>
        </div>
    );
}


