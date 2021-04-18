import styled from 'styled-components/macro';
import {
    email_container_background,
    email_text_area_bg,
    link_hover_color,
    main_text_color,
} from '../misc/StyleConsts';

export const DetailedSearchResultStyle = styled.div`
    padding: 10px;
    border-bottom: 2px solid white;
    width: calc(100vw - 60px);
    overflow: hidden;
    .children {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        & > * {
            margin: 5px;
            padding: 10px;
            background-color: ${email_text_area_bg};
            color: ${main_text_color};
            max-width: 400px;
        }
    }
    .header {
        color: white;
        font-weight: bold;
        font-size: 24;
        margin: 10px;
    }
`;

export const DetailedEventStyle = styled.div`
    border-radius: 10px;
    margin: 5px;
    .subject {
        color: white;
        font-size: 16px;
    }
    .time {
        color: ${main_text_color};
    }
`;

export const SearchPageWrapperStyle = styled.div`
    width: 100%;
    height: calc(100% - 60px);
    overflow: hidden;
    .simple_bar {
        height: 100%;
    }
`;

export const DetailedContactStyle = styled.div`
    border-radius: 50px;
    color: white;
    display: flex;
    flex-direction: row;
    align-items: center;
    min-width: 200;
    width: max-content;
    margin-top: 5px;
    * {
        margin-right: 5px;
        color: white;
    }
    img.person {
        height: 30px;
        width: 30px;
        border-radius: 100%;
    }
    img.icon {
        height: 20px;
        width: 20px;
    }
    .name {
        margin-right: 20px;
    }
`;
