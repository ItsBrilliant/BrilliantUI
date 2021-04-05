import React from 'react';
import { DetailedSearchResultStyle } from './SearchPage.style';

export function SearchPage(props) {
    return (
        <DetailedSearchResult title="Tasks">
            <span>task1</span>
            <span>task2</span>
        </DetailedSearchResult>
    );
}

function DetailedSearchResult(props) {
    return (
        <DetailedSearchResultStyle>
            <h1 className="header">{props.title}</h1>
            <div className="children">{props.children}</div>
        </DetailedSearchResultStyle>
    );
}
