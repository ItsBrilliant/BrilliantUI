import React, { useState } from 'react';
import { SearchBar } from './SearchBar';
import { SearchList } from './SearchList';
import { SearchStyle } from './Search.style';
import { ApplySearch } from '../../actions/search';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import SearchFilter from './SearchFilter.js';

export function Search(props) {
    const [search_value, set_search] = useState('');
    const [list_visible, set_visible] = useState(false);
    const [focus_locked, lock_focus] = useState(false);
    const [search_filters, set_search_filters] = useState([]);

    const my_on_focus = () => set_visible(true);
    const my_on_blur = () => {
        setTimeout(() => {
            if (!focus_locked) {
                set_visible(false);
                set_search('');
            } else {
                lock_focus(false);
                document.querySelector('#main_search_bar').focus();
            }
        }, 100);
    };
    const dispatch = useDispatch();
    const history = useHistory();
    const my_key_down = (e) => {
        if (e.key === 'Enter') {
            dispatch(ApplySearch(search_value));
            set_visible(false);
            history.push('search');
        }
    };
    return (
        <SearchStyle list_visible={list_visible}>
            <SearchBar
                keyword={search_value}
                my_on_blur={my_on_blur}
                my_on_focus={my_on_focus}
                my_key_down={my_key_down}
                setKeyword={set_search}
            ></SearchBar>
            <SearchFilter
                my_on_focus={my_on_focus}
                search_filters={search_filters}
                set_search_filters={set_search_filters}
            />
            <SearchList
                visible={list_visible}
                search_value={search_value}
                search_filters={search_filters}
                set_search={set_search}
                lock_focus={lock_focus}
            />
        </SearchStyle>
    );
}
