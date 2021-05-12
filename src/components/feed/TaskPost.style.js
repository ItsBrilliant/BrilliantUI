import styled from 'styled-components/macro';
import { link_hover_color, white_lilac } from '../misc/StyleConsts';
import { PostStyle } from './FeedPost';
export const SingleTaskStyle = styled.div`
    display: flex;
    padding: 18px 24px;
    width: 732px;
    min-height: 100px;
    background: #181e32;
    border-radius: 8px;
    align-self: stretch;
    margin: 0 0 16px 0;
    box-sizing: border-box;
    & > * {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
    &:last-child {
        margin: 0;
    }
    .left_section {
        .task_title {
            font-weight: 600;
            font-size: 18px;
            line-height: 110%;
            color: ${white_lilac};
        }
        .task_info {
            display: flex;
            flex-direction: row;
            align-items: center;
            .dot {
                background-color: #565f80;
                border-radius: 100%;
                width: 2px;
                height: 2px;
                margin: 0 8px;
            }
            .status,
            .deadline {
                svg {
                    margin: 0 8px;
                }
                color: #565f80;
                margin: 0;
                font-size: 14px;
                line-height: 110%;
                display: flex;
                align-items: center;
            }
        }
    }
    .right_section {
        margin-left: auto;
        justify-content: space-between;
        align-items: center;
        .priority {
            background-color: lightblue;
            border-radius: 100%;
            width: 8px;
            height: 8px;
            position: relative;
            left: 3px;
        }

        .priority.Urgent {
            background-color: red;
        }
        .priority.CanWait {
            background-color: green;
        }

        .priority.Important {
            background-color: orange;
        }
    }
`;
