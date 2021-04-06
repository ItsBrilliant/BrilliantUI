import React, { useState } from 'react';
import { SearchBar } from './SearchBar';
import { SearchList } from './SearchList';
import { SearchStyle } from './Search.style';
import { ApplySearch } from '../../actions/search';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

export function Search(props) {
    const [search_value, set_search] = useState('');
    const [list_visible, set_visible] = useState(false);
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
                my_on_blur={() =>
                    setTimeout(() => {
                        set_visible(false);
                        set_search('');
                    }, 100)
                }
                my_on_focus={() => set_visible(true)}
                my_key_down={my_key_down}
                setKeyword={set_search}
            ></SearchBar>
            <SearchList visible={list_visible} search_value={search_value} />
        </SearchStyle>
    );
}
