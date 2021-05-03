import styled from 'styled-components/macro';
import { link_hover_color, white_lilac } from '../misc/StyleConsts';

export const SuggestedTaskStyle = styled.div`
    box-sizing: border-box;

    margin: 16px 0px;
    width: 100%;
    height: max-content;
    .task_content {
        display: flex;
        align-items: center;
        border: 2px solid #3c4566;
        border-radius: 8px;
        align-self: stretch;
    }
    * {
        box-sizing: border-box;
    }
    .TaskButtons {
        margin-left: auto;
        display: flex;
        align-items: center;
    }
    .task_source {
        margin-bottom: 16px;
        span {
            font-weight: bold;
            font-size: 15px;
            line-height: 120%;
            color: ${white_lilac};
            margin-left: 8px;
        }
    }
    .task_text {
        font-weight: 600;
        font-size: 16px;
        line-height: 120%;
        display: flex;
        align-items: center;
        color: ${white_lilac};
    }

    button.approve {
        background: ${link_hover_color};
        height: 32px;
        width: 32px;
        border: 2px solid ${white_lilac};
        border-radius: 8px;
        font-weight: normal;
        padding-top: 0;
        font-size: 26px;
        margin: 0;
        color: ${white_lilac};
    }

    button.decline {
        height: 32px;
        width: 74px;
        background: #101421;
        color: ${link_hover_color};
        border: 2px solid ${link_hover_color};
        border-radius: 8px;
        margin: 0px 8px;
    }
`;
