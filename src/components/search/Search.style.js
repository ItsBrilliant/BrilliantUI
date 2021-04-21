import styled from 'styled-components/macro';
import { URGENT, IMPORTANT, CAN_WAIT } from '../../data_objects/Consts';
import {
    email_container_background,
    email_text_area_bg,
    link_hover_color,
    main_bg_color,
    main_text_color,
} from '../misc/StyleConsts';
import { option_style } from '../../components/filter/Filter.styles';

export const SearchBarStyle = styled.div`
    background-color: var(--email-container-background);
    border: 1px solid var(--main-text-color);
    border-radius: 10px;
    margin: 10px 10px 10px 30px;
    z-index: 2001;
    .search_bar_input,
    .search_filter {
        padding: 10px;
        box-sizing: border-box;
    }
    .search_bar_input {
        display: flex;
        align-items: center;

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
    }
    .search_filter {
        display: ${(props) => (props.is_active ? 'visible' : 'none')};
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
    z-index: 1001;
    .SearchList {
        position: relative;
        width: ${(props) => props.width - 60}px;
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
    button.close_search_bar {
        margin: 0 0 0 auto;
        background-color: transparent;
        color: ${main_text_color};
        font-size: 20px;
        padding: 0;
        opacity: ${(props) => props.list_opacity};
    }
`;

export const SearchResultStyle = styled.div.attrs((props) => {
    let color = 'lightblue';
    switch (props.priority) {
        case URGENT:
            color = 'red';
            break;
        case IMPORTANT:
            color = 'orange';
            break;
        case CAN_WAIT:
            color = 'green';
            break;
    }
    return {
        priority_color: color,
    };
})`
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
    .search_result_priority {
        border-radius: 100%;
        background-color: ${(props) => props.priority_color};
        height: 8px;
        width: 8px;
        align-self: center;
        margin-left: 7px;
        display: ${(props) =>
            props.priority === undefined ? 'none' : 'visible'};
    }
`;
export const search_filter_style = {
    container: (provided) => ({
        maxHeight: '100px',
        zIndex: 1002,
    }),
    menuList: (provided, state) => ({
        ...provided,
        borderRadius: '10px',
        backgroundColor: email_text_area_bg,
        color: main_text_color,
        zIndex: 1002,
    }),
    menu: (provided, state) => ({
        backgroundColor: 'transparent',
        zIndex: 1002,
    }),
    option: option_style,
    multiValue: (provided, state) => ({
        ...provided,
        backgroundColor: link_hover_color,
        color: 'black',
        fontWeight: 'bold',
        fontSize: '20px',
        borderRadius: '10px',
    }),
    control: () => ({
        backgroundColor: 'transparent',
        zIndex: 1002,
    }),
    multiValueLabel: (provided) => ({
        ...provided,
        color: 'black',
    }),
    indicatorsContainer: () => ({
        display: 'none',
    }),
    input: (provided) => ({
        ...provided,
        color: main_text_color,
    }),
};
