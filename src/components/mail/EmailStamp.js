import { format_date } from '../../utils.js';
import React from 'react';

export function TimeStamp(date) {
    const formatted_date = format_date(date)
    return (
        <div className='TimeStamp'>
            <p>{formatted_date.time}</p>
            <p>{formatted_date.date}</p>
        </div>
    );
}

export function EmailStamp(icons, date, name) {
    //            <h4>{name}</h4>
    return (
        <div className='emailStamp'>
            {GroupIcon(icons)}
            {TimeStamp(date)}
        </div>
    )
}

export function GroupIcon(icons) {
    var img_style = "threadIcon";
    if (icons.length > 1) {
        img_style = img_style + " multi"
    }
    const MAX_ICONS = 6;
    const merged = icons.slice(0, MAX_ICONS).map((icon) => <img className={img_style} src={icon}></img>);
    var extra_icons = icons.length - MAX_ICONS;
    const plus = extra_icons > 0 ? <span className="extra_icon">{"+" + extra_icons}</span> : null;
    return (
        <div className="GroupIcon">{merged} {plus}</div>
    );
}