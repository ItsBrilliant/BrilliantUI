import React from 'react';
import ReactDOM from 'react-dom'
import './Globals.css'


export function GeneralPortal(props) {
    const portal = (
        <>
            <div className="invisible_portal_wrapper" onClick={(e) => {
                e.preventDefault();
                props.handle_close();
            }} />
            {props.component}
        </>);

    return !props.visible ? null :
        ReactDOM.createPortal(
            portal,
            document.getElementById('messages_to_user')
        );
}
