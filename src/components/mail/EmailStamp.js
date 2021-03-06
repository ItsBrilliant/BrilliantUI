import { format_date } from '../../utils.js';
import React from 'react';
import './EmailStamp.css';
import { Contact } from '../../data_objects/Contact.js';

export function TimeStamp(date) {
    const formatted_date = format_date(date)
    return (
        <div className='TimeStamp'>
            <p>{formatted_date.time}</p>
            <p>{formatted_date.date}</p>
        </div>
    );
}

export function EmailStamp(icons, date) {
    //            <h4>{name}</h4>
    return (
        <div className='emailStamp'>
            {GroupIcon(icons)}
            {TimeStamp(date)}
        </div>
    )
}

export function GroupIcon(icons, MAX_ICONS = 6, size = 50, spacing = 20) {
    if (icons[0] instanceof Contact) {
        icons = icons.map(i => i.get_icon());
    }
    var class_name = "threadIcon";
    if (icons.length > 1) {
        class_name = class_name + " multi"
    }
    const image_style = {
        width: size,
        height: size
    }
    var extra_icons = icons.length - MAX_ICONS;
    const merged = icons.slice(0, MAX_ICONS).map((icon, index) =>
        <img key={index} style={image_style} className={class_name} src={icon}></img>);
    const group_style = icons.length > 1 ?
        {
            width: `${spacing * merged.length - spacing + size}px`,
            gridTemplateColumns: `repeat(auto-fit, ${spacing}px)`,
            marginRight: `${size - spacing + 10}px`
        } :
        {
            width: `${size}px`
        }



    const plus = extra_icons > 0 ? <span
        className="extra_icon"
        style={{
            fontSize: `${size * 0.4}px`,
            marginLeft: -`${size - spacing + 10}px`
        }}>
        {"+" + extra_icons}
    </span> : null;
    return (
        <div className="GroupIcon" style={group_style}>{merged} </div>
    );
}