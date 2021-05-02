import React from 'react';
import { FeedComponentStyle } from './Feed.style';

export default function FeedComponent(props) {
    return <FeedComponentStyle>{props.children}</FeedComponentStyle>;
}

export function ButtonsRow(props) {
    const buttons = props.buttons.map((b) => (
        <button onClick={b.action}>{b.name}</button>
    ));
    return <div className="ButtonsRow">{buttons}</div>;
}
