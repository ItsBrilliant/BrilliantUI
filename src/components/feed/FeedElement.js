import React from 'react'
import {FeedElementStyle} from './Feed.style'

export default function FeedElement(props) {
    return (
        <FeedElementStyle>
            <span className="element_title">{props.title}</span>
            <span className="element_time">{props.time}</span>
            <span className="element_component">{props.component}</span>
            <button className="close_button">&times;</button>
        </FeedElementStyle>
    )
}
