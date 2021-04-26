import styled from 'styled-components/macro';
import {
    white_lilac,
    pickled_bluewood,
    link_hover_color,
    muted_mid_gray,
} from '../misc/StyleConsts';

export const SelectedFilterStyle = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 6px 12px;

    position: static;
    height: 32px;
    left: 0px;
    top: 8.5px;

    /* Picton Blue */

    background: ${link_hover_color};
    border-radius: 8px;

    /* Inside Auto Layout */

    flex: none;
    order: 0;
    flex-grow: 0;
    margin: 0px 16px;
    .filter_name {
        position: static;
        height: 19px;
        right: 28px;
        top: calc(50% - 19px / 2);
        font-style: normal;
        font-weight: 600;
        font-size: 16px;
        line-height: 120%;
        /* or 19px */

        display: flex;
        align-items: center;

        /* Muted Mid Gray */

        color: ${muted_mid_gray};

        /* Inside Auto Layout */
        margin: 0px 8px;
    }
    .delete {
        background-color: transparent;
        color: ${muted_mid_gray};
        font-size: 26px;
    }
`;

export const SearchFilterButtonsStyle = styled.div`
    .title {
        /* i’m searching for */
        font-family: Space Grotesk;
        font-style: normal;
        font-weight: normal;
        font-size: 15px;
        line-height: 120%;
        /* identical to box height, or 18px */

        display: flex;
        align-items: center;
        font-feature-settings: 'ss02' on, 'ss03' on, 'ss04' on;

        /* Slate Gray */

        color: #7885a1;
        margin: 8px 0px;
    }
    .filter_buttons {
        display: flex;
        flex-direction: row;
        margin: 5px;
    }
    .select_filter_button {
        /* Frame 145 */

        /* Auto Layout */

        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 7px 12px;
        height: 32px;

        /* Pickled Bluewood */

        background: ${pickled_bluewood};
        border-radius: 8px;

        /* Inside Auto Layout */

        flex: none;
        order: 0;
        flex-grow: 0;
        margin: 0px 7px;
    }

    .filter_option_text {
        position: static;
        height: 15px;

        font-family: Space Grotesk;
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        line-height: 110%;
        margin: 0px 5px;
        /* or 15px */

        display: flex;
        align-items: center;
        text-align: center;
        font-feature-settings: 'case' on, 'ss02' on, 'ss03' on, 'ss04' on;

        /* White Lilac */

        color: ${white_lilac};
    }
`;
