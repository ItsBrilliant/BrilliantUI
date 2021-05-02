import styled from 'styled-components/macro';
import {
    email_text_area_bg,
    main_text_color,
    email_container_background,
    main_bg_color,
    link_hover_color,
    white_lilac,
} from '../misc/StyleConsts';
const INNER_FEED_WIDTH = 732;
export const FeedElementStyle = styled.div`
    color: ${main_text_color};
    background-color: #101421;
    display: grid;
    grid-template-columns: 80px ${INNER_FEED_WIDTH - 20}px 20px;
    grid-template-rows: 40px 1fr;
    justify-items: flex-start;
    align-items: center;
    width: 1260px;
    position: relative;
    height: max-content;
    padding: 16px 200px;
    margin: 16px 0px;
    box-sizing: border-box;
    grid-template-areas:
        'time title close_button'
        '. component component';
    .element_title {
        grid-area: title;
        font-size: 24px;
        font-weight: bold;
        color: #ffffff;
    }
    .element_time {
        grid-area: time;
        font-size: 20px;
    }
    .close_button {
        grid-area: close_button;
        background-color: transparent;
        color: ${main_text_color};
        font-size: 32px;
        margin-left: auto;
    }
    .element_component {
        width: 100%;
        grid-area: component;
        margin-bottom: 10px;
    }
`;

export const FeedWrapper = styled.div`
    width: 100%;
    height: calc(100% - 60px);
    overflow: hidden;
    .simple_bar {
        height: 100%;
    }
`;

export const BrilliantFeedStyled = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 100%;
    h1 {
        color: white;
    }
`;

export const FeedComponentStyle = styled.div`
    width: ${INNER_FEED_WIDTH}px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 32px 16px;
    background: #181e32;
    border-radius: 8px;
    align-self: stretch;
    margin: 16px 0px;
    box-sizing: border-box;
`;

export const EmailPostStyle = styled.div`
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    margin: 16px 0px;
    .EmailThread {
        width: 668px;
        margin: 0 0 16px 0;
        background-color: #202842;
    }

    .ButtonsRow {
        display: flex;
        justify-content: stretch;
        width: ${INNER_FEED_WIDTH}px;
        button {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            flex-grow: 1;
            height: 40px;

            /* Mirage */

            background: #181e32;
            border-radius: 8px;
            // The label
            color: ${white_lilac};
            font-weight: 600;
            font-size: 16px;
            line-height: 120%;
            margin: 16px 8px 0 8px;
        }
    }
`;

export const IncrementalStyle = styled.div`
    .indicators {
        display: flex;
        justify-content: center;
        align-items: center;
        height: max-content;
        width: 100%;

        button {
            background-color: transparent;
            font-weight: bold;
            font-size: 20px;
            color: ${main_text_color};
            align-self: center;
            outline: none;
        }
        span {
            margin: 2px;
            width: 10px;
            height: 10px;
            border-radius: 100%;
            border: 1px solid white;
            &.selected {
                background-color: white;
            }
        }
    }
`;

/*
    .EmailThread {
        background-color: ${main_bg_color};
        margin: 10px;
    }

    .CalendarTask {
        margin-bottom: 5px;
        background-color: ${main_bg_color};
    }
    .EmailComposer {
        position: static;
        height: 200px;
    }
    .EmailContainer {
        height: 190px;
        overflow: hidden;
    }
    .EmailContainer * {
        background-color: transparent;
    } */
