import { SearchBarStyle } from './Search.style';
import React from 'react';

export const SearchBar = ({ ...props }) => {
    return (
        <SearchBarStyle>
            <img src="button_icons/search.png"></img>
            <input
                autoComplete="off"
                id="main_search_bar"
                key="search_bar"
                value={props.keyword}
                placeholder={'search'}
                onChange={(e) => {
                    props.setKeyword(e.target.value);
                    props.my_on_focus();
                }}
                onFocus={props.my_on_focus}
                onBlur={props.my_on_blur}
                onKeyDown={props.my_key_down}
            />
        </SearchBarStyle>
    );
};
