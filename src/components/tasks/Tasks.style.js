import styled from 'styled-components/macro';
import {
    email_text_area_bg,
    main_text_color,
    email_container_background,
    main_bg_color,
    white_lilac,
    link_hover_color,
} from '../misc/StyleConsts';
import { URGENT, IMPORTANT, CAN_WAIT } from '../../data_objects/Consts';
const TASKS_WIDTH = 1962;
export const TasksStyle = styled.div`
    background-color: ${email_container_background};
    margin: 24px 0 0 48px;
    border-radius: 8px;
    padding: 10px;
    width: ${TASKS_WIDTH}px;
    height: calc(100vh - 100px);
    box-sizing: border-box;
    overflow: hidden;
`;

const TaskGrid = styled.div`
    color: ${white_lilac};
    display: grid;
    grid-template-columns: 0.2fr 5fr 1fr 1fr 1fr 2fr 1fr 2.5fr;
    justify-items: center;
    align-items: center;
    align-self: stretch;
    width: ${TASKS_WIDTH}px;
    height: 64px;
    padding: 0 0 5px 0;
    flex-grow: 0;
    margin: 8px 15px;
    box-sizing: border-box;
    grid-template-areas: 'multiselect first_column priority owner status watchers deadline tags';
    .priority {
        grid-area: priority;
    }
    .owner {
        grid-area: owner;
    }
    .status {
        grid-area: status;
    }
    .watchers {
        grid-area: watchers;
    }
    .deadline {
        grid-area: deadline;
    }
    .tags {
        max-height: 100%;
        grid-area: tags;
        display: flex;
        flex-wrap: wrap;
        overflow: hidden;
    }
`;

export const TaskRowStyle = styled(TaskGrid)`
    font-size: 15px;
    background: ${email_text_area_bg};
    color: ${white_lilac};
    height: 60px;
    width: ${TASKS_WIDTH};
    margin: 5px 15px;
    border-radius: 10px;
    border: 2px solid;
    border-color: ${(props) =>
        props.is_multiselected ? 'white' : 'transparent'};
    .task_text {
        grid-area: first_column;
        justify-self: start;
    }
    .task_text:hover {
        cursor: pointer;
    }
    .tag {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 4px 8px;
        text-align: center;
        height: 22px;
        font-style: normal;
        font-weight: bold;
        font-size: 12px;
        line-height: 120%;
        background: #fce4ec;
        border-radius: 4px;
        color: #e91e63;
        margin: 0px 8px;
    }
    .Dropdown-menu,
    .Dropdown-control {
        min-width: max-content;
        padding: 5px;
    }
    .Dropdown-control {
        padding-right: 35px;
        background-color: transparent;
    }
    &:hover {
        border-color: ${(props) =>
            props.is_multiselected ? 'white' : link_hover_color};
    }
    .multiselect {
        transition: opacity 0.7s ease;
        position: relative;
        left: -12px;
        grid-area: multiselect;
        width: 10px;
        height: 10px;
        border-radius: 100%;
        border: 2px solid white;
        background-color: ${(props) =>
            props.is_multiselected ? 'white' : 'black'};
        opacity: ${(props) => (props.multiselect_visible ? '1' : '0')};
    }
    .multiselect:hover {
        background-color: gray;
    }
    .deadline,
    .task_text,
    .status {
        font-size: 15px;
        line-height: 120%;
        display: flex;
        align-items: center;
        font-feature-settings: 'ss02' on, 'ss03' on, 'ss04' on;
    }
    .status .Dropdown-control,
    .status .Dropdown-option {
        color: ${white_lilac};
    }
`;

export const GroupedTasksStyle = styled.div.attrs((props) => {
    let my_color = 'pink';
    console.log(props.priority);
    if (props.priority === URGENT) {
        my_color = 'red';
    } else if (props.priority === IMPORTANT) {
        my_color = 'orange';
    } else if (props.priority === CAN_WAIT) {
        my_color = 'green';
    }
    return {
        my_color: my_color,
    };
})`
    color: ${(props) => props.my_color};
    p {
        margin-left: 10px;
    }
`;

export const TaskHeaderStyle = styled(TaskGrid)`
    background-color: ${email_container_background};
    height: 40px;
    width: ${TASKS_WIDTH}px;
    span.header {
        cursor: pointer;
        justify-self: center;
    }
    .filter_buttons {
        grid-area: multiselect / first_column;
        justify-self: start;

        button {
            border: 1px solid #6ba1db;
            background-color: transparent;
            font-weight: 600;
            font-size: 14px;
            line-height: 110%;
            color: ${main_text_color};
            margin: 0px 0px;
        }
        button:first-child {
            border-radius: 4px 0px 0px 4px;
        }
        button:last-child {
            border-radius: 0px 4px 4px 0px;
        }
        button.selected {
            background-color: ${link_hover_color};
            color: ${email_text_area_bg};
        }
    }
    .arrow {
        align-self: center;
        margin: 0 5px;
        height: 12px;
        width: 12px;
        position: relative;
        top: 2px;
    }
`;

const PortalStyle = styled.div`
    background-color: #535c7b;
    border-radius: 10px;
    width: ${(props) => props.width}px;
    position: fixed;
    z-index: 2000;
    padding: 10px;
    input.input {
        width: 100%;
        box-sizing: border-box;
        background-color: lightblue;
        border-radius: 5px;
        margin-bottom: 10px;
    }
`;

export const AddWatchersStyle = styled(PortalStyle)`
    left: ${(props) => props.location.x}px;
    bottom: calc(100vh - ${(props) => props.location.y}px);
    .NameWithIcon {
        display: flex;
        align-items: center;

        .contact_name {
            cursor: pointer;
            margin-right: 5px;
        }

        .minus_icon {
            margin-left: auto;
            font-weight: bold;
            font-size: 26px;
        }
    }
    .NameWithIcon:hover {
        background-color: ${link_hover_color};
    }
`;

const add_tag_width = 250;
export const AddTagStyle = styled(PortalStyle)`
    background-color: #535c7b;
    border-radius: 10px;
    width: ${add_tag_width}px;
    position: fixed;
    top: ${(props) => props.location.y + 20}px;
    left: ${(props) => props.location.x - add_tag_width - 50}px;
    z-index: 2000;
    padding: 20px;
    .tag-item {
        border-radius: 5px;
        padding: 0 4px;
        background-color: lightgreen;
        .button {
            padding: 0px;
            border-radius: 0;
            background-color: transparent;
        }
    }
`;
export const MultiselectActionsStyle = styled.div`
    position: fixed;
    left: 600px;
    top: 12px;
    display: flex;
    color: ${main_text_color};
    background-color: ${email_text_area_bg};
    opacity: ${(props) => (props.visible ? 1 : 0)};
    transition: opacity 0.7s ease;
    padding: 5px 8px;
    border-radius: 3px;
    z-index: 2000;

    button {
        border-radius: 3px;
        outline: none;
        border: none;
        background-color: ${email_container_background};
        margin-left: 10px;
        pointer-events: ${(props) => (props.visible ? 'auto' : 'none')};
    }
    button.delete {
        color: red;
    }
    button.cancel {
        color: ${main_text_color};
    }
`;

export const SelectOwnerStyle = styled(PortalStyle)`
    left: ${(props) => props.location.x}px;
    bottom: calc(100vh - ${(props) => props.location.y}px);
    width: 300px;
`;
