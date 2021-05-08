import React, { useState } from 'react';
import FeedComponent, { ButtonsRow } from './FeedComponent';
import { LineIcon, ChevronIcon } from '../misc/svg_icons';
import styled from 'styled-components/macro';
import { white_lilac } from '../misc/StyleConsts';
import { FeedComponentStyle } from './Feed.style';

const EXPANDED_LIMIT = 7;
const DEFAULT_LIMIT = 3;
export default function FeedPost(props) {
    const expanded_limit = props.expanded_limit || EXPANDED_LIMIT;
    const default_limit = props.default_limit || DEFAULT_LIMIT;
    const [expanded, set_expanded] = useState(false);
    let items = props.items;
    const toggle_expansion = () => {
        set_expanded(!expanded);
    };
    if (items.length === 0) {
        return null;
    }

    const needs_expansion = props.items.length > default_limit;
    const limit = expanded ? expanded_limit : default_limit;
    items = items.slice(0, limit);
    const item_components = props.map_to_components(items);
    return (
        <PostStyle type={props.type}>
            {item_components}
            {needs_expansion ? (
                <ViewAll
                    toggle_expansion={toggle_expansion}
                    expanded={expanded}
                />
            ) : null}
            <ButtonsRow buttons={props.buttons} />
        </PostStyle>
    );
}

function ViewAll(props) {
    const text = props.expanded ? 'Hide' : 'View all';
    const chevron_style = 'chevron' + (props.expanded ? ' expanded' : '');
    return (
        <div className="ViewAll">
            <LineIcon />
            <button onClick={props.toggle_expansion}>{text}</button>
            <span className={chevron_style}>
                <ChevronIcon />
            </span>
            <LineIcon />
        </div>
    );
}

export function sort_priority_time(a, b) {
    const priority_diff = a.get_priority() - b.get_priority();
    return priority_diff !== 0 ? priority_diff : b.get_date() - a.get_date();
}

const INNER_FEED_WIDTH = 732;

export const PostStyle = styled.div`
    width: ${INNER_FEED_WIDTH}px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 32px 16px;
    background: ${(props) =>
        props.type === 'tasks' ? 'transparent' : '#181e32'};
    border-radius: 8px;
    align-self: stretch;
    margin: 16px 0px;

    .ButtonsRow {
        display: flex;
        justify-content: stretch;
        width: ${INNER_FEED_WIDTH}px;
        button:first-child {
            margin: 16px 8px 16px 0;
        }
        button:last-child {
            margin: 16px 0 16px 8px;
        }
        button {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            flex-grow: 1;
            height: 40px;
            background: #181e32;
            border-radius: 8px;
            color: ${white_lilac};
            font-weight: 600;
            font-size: 16px;
            line-height: 120%;
            margin: 16px 8px;
        }
    }
    .ViewAll {
        display: flex;
        align-items: center;
        & * {
            margin: 0 4px;
        }
        .chevron {
            margin: 0;
            &.expanded {
                transform: rotateZ(180deg);
            }
        }
        button {
            width: 70px;
            height: 18px;
            font-weight: bold;
            font-size: 15px;
            line-height: 120%;
            color: #565f80;
            background-color: transparent;
        }
    }
`;
