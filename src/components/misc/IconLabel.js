import React from 'react';
import { MailIcon } from './svg_icons';
import styled from 'styled-components/macro';

export default function IconLabel(props) {
    return (
        <IconLabelStyle color={props.color}>
            {props.icon}
            <span>{props.label}</span>
        </IconLabelStyle>
    );
}

const IconLabelStyle = styled.div`
    background-color: transparent;
    display: flex;
    flex-direction: row;
    align-items: center;
    border: 1px solid;
    border-color: ${(props) => props.color};
    padding: 8px 16px 8px 12px;
    border-radius: 4px;
    box-sizing: border-box;
    height: 32px;
    margin: 0 4px;
    span {
        color: ${(props) => props.color};
        font-weight: bold;
        font-size: 14px;
        line-height: 120%;
        margin: 0 12px;
        text-align: right;
    }
    svg {
        width: 15px;
        height: 15px;
    }
`;
