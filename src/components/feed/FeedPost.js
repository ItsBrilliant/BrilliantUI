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
            <div className="component">
                {item_components}
                {needs_expansion ? (
                    <ViewAll
                        toggle_expansion={toggle_expansion}
                        expanded={expanded}
                    />
                ) : null}
            </div>
            <ButtonsRow buttons={props.buttons} />
        </PostStyle>
    );
}

function ViewAll(props) {
    const line_width = props.line_width || 280;
    const text = props.expanded ? 'Hide' : 'View all';
    const chevron_style = 'chevron' + (props.expanded ? ' expanded' : '');
    return (
        <div className="ViewAll">
            <LineIcon width={line_width} />
            <button onClick={props.toggle_expansion}>{text}</button>
            <span className={chevron_style}>
                <ChevronIcon />
            </span>
            <LineIcon width={line_width} />
        </div>
    );
}

export function sort_priority_time(a, b) {
    const priority_diff = a.get_priority() - b.get_priority();
    return priority_diff !== 0 ? priority_diff : b.get_date() - a.get_date();
}

const INNER_FEED_WIDTH = 732;

export const PostStyle = styled.div`
    margin: 16px 0px;
    width: ${INNER_FEED_WIDTH}px;
    .component {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 24px 0 16px 0;
        background: ${(props) =>
            props.type === 'tasks' ? 'transparent' : '#181e32'};
        border-radius: 8px;
        align-self: stretch;
        margin: 0;
        box-sizing: border-box;
        .EmailThread {
            width: 668px;
            margin: 0 0 16px 0;
            background-color: #202842;
            box-sizing: border-box;
        }

        .ViewAll {
            box-sizing: border-box;
            width: 100%;
            padding: 0 32px;
            display: flex;
            align-items: center;
            justify-content: space-between;
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
    }
    .ButtonsRow {
        margin: 0;
        display: flex;
        justify-content: stretch;
        width: ${INNER_FEED_WIDTH}px;
        background-color: #101421;
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
`;
