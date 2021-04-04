import styled from 'styled-components';
import {
    email_container_background,
    link_hover_color,
    main_text_color,
} from '../StyleConsts';

export const SearchBarStyle = styled.div`
    display: flex;
    align-items: center;
    background-color: var(--email-container-background);
    padding: 10px;
    margin: 10px 10px 10px 30px;
    border-radius: 10px;
    border: 1px solid var(--main-text-color);
    box-sizing: border-box;
    input,
    input::placeholder {
        font-weight: bold;
        background-color: transparent;
        font-size: 16px;
        color: var(--main-text-color);
        outline: none;
    }

    img {
        margin-right: 10px;
        width: 20px;
    }
`;

export const SearchStyle = styled.div.attrs((props) => ({
    width: props.list_visible ? '800' : '200',
    height: props.list_visible ? '100vh' : '60px',
    list_opacity: props.list_visible ? '1' : '0',
    pointer_events: props.list_visible ? 'auto' : 'none',
}))`
    box-sizing: border-box;
    width: ${(props) => props.width}px;
    height: ${(props) => props.height};
    overflow: hidden;
    transition: height, width 1s ease;
    position: relative;
    .SearchList {
        position: relative;
        width: ${(props) => props.width - 60}px;
        z-index: 3000;
        background-color: ${email_container_background};
        color: ${main_text_color};
        padding: 10px;
        margin: 10px 10px 10px 30px;
        border-radius: 10px;
        border: 1px solid var(--main-text-color);
        transition: height, width 1s ease;
        opacity: ${(props) => props.list_opacity};
        pointer-events: ${(props) => props.pointer_events};
    }
`;

export const SearchResultStyle = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    p,
    img {
        margin: 5px;
    }
    .timestamp {
        margin-left: auto;
    }
    .matched_search_text {
        color: white;
    }
    &:hover {
        background-color: ${link_hover_color};
        color: black;
        cursor: pointer;
    }
`;
