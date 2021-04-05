import React from 'react';
import { SearchResultStyle } from './Search.style';
import { render_search_text } from './utils';

export function SearchResults(props) {
    if (props.search_value.length < 2) {
        return null;
    }
    let filtered = props.data.filter((item) =>
        props.filter_function(item, props.search_value)
    );
    if (props.max_results) {
        filtered = filtered.slice(0, props.max_results);
    }
    const results = filtered.map((item) => (
        <SearchResultStyle onClick={() => props.my_on_click(item)}>
            <img src={props.icon} />
            <span>
                {render_search_text(props.top_line(item), props.search_value)}
                {render_search_text(
                    props.bottom_line(item),
                    props.search_value
                )}
            </span>
            <span className="timestamp">{props.time_stamp(item)}</span>
        </SearchResultStyle>
    ));
    return <>{results}</>;
}
