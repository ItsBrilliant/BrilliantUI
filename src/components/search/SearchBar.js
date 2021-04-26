import { SearchBarStyle } from './Search.style';
import React from 'react';
import SearchFilter from './SearchFilter.js';
import SearchFilterButtons, { SelectedFilter } from './SearchFilterButtons';
export const SearchBar = ({ ...props }) => {
    const placeholder = props.is_active
        ? 'Search for conversations tasks and more'
        : 'Search';
    return (
        <SearchBarStyle is_active={props.is_active}>
            <div className="search_bar_input">
                <img src="button_icons/search.png"></img>
                <SelectedFilter
                    visible={props.is_active}
                    selected_filter={props.selected_filter}
                    set_selected_filter={props.set_selected_filter}
                />
                <input
                    autoComplete="off"
                    id="main_search_bar"
                    key="search_bar"
                    value={props.keyword}
                    placeholder={placeholder}
                    onChange={(e) => {
                        props.setKeyword(e.target.value);
                        props.my_on_focus();
                    }}
                    onFocus={props.my_on_focus}
                    onKeyDown={props.my_key_down}
                />
                <button className="close_search_bar" onClick={props.on_close}>
                    &times;
                </button>
            </div>
            <SearchFilterButtons
                visible={props.is_active}
                selected_filter={props.selected_filter}
                set_selected_filter={props.set_selected_filter}
            />
        </SearchBarStyle>
    );
};
/*
<div className="search_filter">
<SearchFilter
    my_on_focus={props.my_on_focus}
    search_filters={props.search_filters}
    set_search_filters={props.set_search_filters}
/>
</div>*/
