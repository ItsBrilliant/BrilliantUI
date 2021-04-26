import {
    brigher_background,
    main_text_color,
    link_hover_color,
    email_text_area_bg,
    email_container_background,
} from '../misc/StyleConsts';
import styled from 'styled-components';
import { contentReady } from '@syncfusion/ej2-schedule';
import { getStartEndHours } from '@syncfusion/ej2-schedule';

const FILTER_WIDTH = 400;
const common_menu_list_style = {
    zIndex: 1001,
    backgroundColor: brigher_background,
    borderRadius: '10px',
};

export const option_style = (provided, state) => ({
    ...provided,
    color: 'white',
    backgroundColor: 'transparent',
    ':hover': {
        backgroundColor: link_hover_color,
    },
});
const control_style = {
    // none of react-select's styles are passed to <Control />
    width: `${FILTER_WIDTH}px`,
    color: 'red',
    //   border: '1px solid green',
    zIndex: 1002,
};
export const main_menu_style = {
    menuList: (provided, state) => ({
        ...provided,
        ...common_menu_list_style,
        zIndex: 1001,
        position: 'absolute',
        left: '-120px',
        top: '50px',
        width: '120px',
    }),
    menu: (provided, state) => ({
        backgroundColor: 'transparent',
    }),
    control: () => ({
        ...control_style,
        position: 'absolute',
        left: '-20px',
        top: '-15px',
    }),
    option: option_style,
    indicatorsContainer: () => ({
        display: 'none',
    }),
};

export const sub_menu_style = {
    menuList: (provided, state) => ({
        ...provided,
        ...common_menu_list_style,
        position: 'relative',
        left: '0',
        marginLeft: '2px',
        top: '70px',
        width: 'max-content',
    }),
    menu: (provided, state) => ({
        ...provided,
        backgroundColor: 'transparent',
    }),
    control: () => ({
        backgroundColor: email_container_background,
        position: 'absolute',
        top: '50px',
    }),
    input: () => ({
        color: main_text_color,
        zIndex: 1001,
    }),
    option: option_style,
};
export const FilterStyle = styled.div`
    //   border: 2px solid yellow;
    min-width: 300px;
    display: flex;
    align-items: center;
    position: relative;
    margin: 4px 0 0 0;
    left: 0;
    top: 0;
    .filter_label {
        text-align: center;
        font-size: 16px;
        width: 90px;
        height: 44px;
        &:hover {
            cursor: pointer;
        }
        /* Auto Layout */
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0px 16px;
        background: #202842;
        border: 1px solid #202842;
        border-radius: 8px;
        .text {
            font-style: normal;
            font-weight: 600;
            font-size: 16px;
            line-height: 120%;
            color: #bdc8df;
            display: flex;
            align-items: center;
        }
        svg {
            margin: 0 14px 0 0;
        }
    }
`;
