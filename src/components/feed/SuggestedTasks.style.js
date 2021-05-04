import styled from 'styled-components/macro';
import { link_hover_color, white_lilac } from '../misc/StyleConsts';

export const SuggestedTaskStyle = styled.div`
    box-sizing: border-box;
    margin: 16px 0px;
    width: 100%;
    height: max-content;
    .task_content {
        border: 2px solid #3c4566;
        border-radius: 8px;
        align-self: stretch;
        .task_header_row {
            border-radius: 6px;
            display: flex;
            align-items: center;
            &.completed_suggestion {
                background-color: ${(props) =>
                    props.type === 'created' ? '#565f80' : '#101421'};
            }
            &.dismissed {
                background-color: #101421;
            }
            .summary {
                display: flex;
                align-items: center;
                .text {
                    color: #7885a1;
                    margin: 0 8px;
                    &.created {
                        color: #f4f6fb;
                    }
                }
                margin: 0 8px 0 auto;
            }
        }
        .email_context {
            font-weight: normal;
            font-size: 15px;
            line-height: 120%;
            color: ${white_lilac};
            padding: 14px 28px;
        }
    }
    * {
        box-sizing: border-box;
    }
    .TaskButtons {
        margin-left: auto;
        display: flex;
        align-items: center;
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

export const TaskSourceEmailStyle = styled.div`
    display: flex;
    align-items: center;
    box-sizing: border-box;
    margin: 16px 0px;
    width: 100%;

    .email_left {
        display: flex;
        flex-direction: column;
        margin-left: 8px;
        .subject {
            font-weight: bold;
            font-size: 15px;
            line-height: 120%;
            color: ${white_lilac};
        }
        .participants {
            font-weight: 600;
            font-size: 12px;
            line-height: 120%;
            color: #7885a1;
        }
    }
    .timestamp {
        font-weight: 600;
        font-size: 14px;
        line-height: 110%;
        color: #565f80;
        margin: 0 8px 0 auto;
    }
`;
