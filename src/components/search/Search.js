import React, { useState } from 'react';
import { SearchBar } from './SearchBar';
import { SearchList } from './SearchList';
import { SearchStyle } from './Search.style';
import { ApplySearch } from '../../actions/search';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

export function Search(props) {
    const [search_value, set_search] = useState('');
    const [is_active, set_active] = useState(false);
    const [selected_filter, set_selected_filter] = useState(null);

    const my_on_focus = () => set_active(true);
    const dispatch = useDispatch();
    const history = useHistory();
    const my_key_down = (e) => {
        if (e.key === 'Enter') {
            dispatch(ApplySearch(search_value));
            set_active(false);
            history.push('search');
        }
    };
    return (
        <SearchStyle list_visible={is_active}>
            <SearchBar
                keyword={search_value}
                my_on_focus={my_on_focus}
                my_key_down={my_key_down}
                setKeyword={set_search}
                selected_filter={selected_filter}
                set_selected_filter={set_selected_filter}
                is_active={is_active}
                on_close={() => set_active(false)}
            ></SearchBar>
            <SearchList
                visible={is_active}
                search_value={search_value}
                set_search={set_search}
                on_select={() => set_active(false)}
                selected_filter={selected_filter}
            />
        </SearchStyle>
    );
}
