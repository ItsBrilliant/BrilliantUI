import styled from 'styled-components/macro';
import {
    email_container_background,
    email_text_area_bg,
    link_hover_color,
    main_text_color,
} from '../StyleConsts';

export const DetailedSearchResultStyle = styled.div`
    padding: 20px;
    border-bottom: 2px solid white;
    .children {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        & > * {
            margin-right: 5px;
            padding: 10px;
            background-color: ${email_text_area_bg};
            color: ${main_text_color};
        }
    }
    .header {
        color: white;
        font-weight: bold;
        font-size: 24;
    }
`;
