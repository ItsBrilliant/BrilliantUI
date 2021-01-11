import React, { useState } from 'react'

import './LoginPage.css';

export function LoginPage(props) {
    const [user, setUser] = useState(props.user_address);
    return (
        <div className="LoginPage">
            <h2>Login</h2>
            <label for="user_email"> Email: </label>
            <input id='user_email' value={user}
                onChange={(e) => setUser(e.target.value)}></input>
            <button onClick={() => props.on_login(user)}>Sign in</button>
        </div>
    );
}

