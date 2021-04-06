import React from 'react';
import { SearchResultStyle } from './Search.style';
import { render_search_text } from './utils';
import { useSearchResultSelect } from '../../hooks/search';
import { EVENT_FILTER_FUNCTION, EVENT_PROPS } from './events';
import { TASK_FILTER_FUNCTION, TASK_PROPS } from './tasks';
import {
    EMAIL_FILTER_FUNCTION,
    EMAIL_PROPS,
    FILE_FILTER_FUNCTION,
    FILE_PROPS,
} from './conversations';
import { CONTACT_FILTER_FUNCTION, CONTACT_PROPS } from './contacts';

export function SearchResults(props) {
    const my_on_click = useSearchResultSelect(props.url, props.action);
    return (
        <SearchResultStyle onClick={() => my_on_click(props.item)}>
            <img src={props.icon} />
            <span>
                {render_search_text(
                    props.top_line(props.item),
                    props.search_value
                )}
                {render_search_text(
                    props.bottom_line(props.item),
                    props.search_value
                )}
            </span>
            <span className="timestamp">{props.time_stamp(props.item)}</span>
        </SearchResultStyle>
    );
}

export const SEARCH_RESULT_PROPS = {
    event: EVENT_PROPS,
    email: EMAIL_PROPS,
    file: FILE_PROPS,
    task: TASK_PROPS,
    contact: CONTACT_PROPS,
};
export const SEARCH_FILTER_FUNCTIONS = {
    event: EVENT_FILTER_FUNCTION,
    email: EMAIL_FILTER_FUNCTION,
    file: FILE_FILTER_FUNCTION,
    task: TASK_FILTER_FUNCTION,
    contact: CONTACT_FILTER_FUNCTION,
};

export function filter_search_objects(data, type, search_value) {
    const filtered_data = data.filter((item) =>
        SEARCH_FILTER_FUNCTIONS[type](item, search_value)
    );
    return filtered_data.map((item) => ({
        type: type,
        item: item,
    }));
}
