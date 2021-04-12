import { useDispatch, useSelector } from 'react-redux';
import { RemoveFilter, SetFilter } from '../../actions/filter';
import OptionsButton from '../OptionsButton';
import SelectedFilters from './SelectedFilters';
import React, { useState } from 'react';
import Select, { components } from 'react-select';
import { customStyles } from './Filter.styles';
import { FilterPriority, FilterTags } from './FilterPriority';
import { useFilters } from '../../hooks/redux';

const MenuList = (props) => {
    return (
        <components.MenuList {...props}>{props.children}</components.MenuList>
    );
};

export default function Filter(props) {
    const filters = useFilters().map((f) => ({
        label: f.value,
        filter_type: f.type,
    }));
    const [priorities_visible, set_priorities_visible] = useState(false);
    const [tags_visible, set_tags_visible] = useState(false);
    const state_setters = {
        priority: set_priorities_visible,
        tags: set_tags_visible,
    };
    const dispatch = useDispatch();
    const select_menu = (options, action) => {
        if (action.action === 'select-option') {
            action.option.open();
        } else if (action.action === 'remove-value') {
            dispatch(RemoveFilter({ type: action.removedValue.filter_type }));
        }
    };
    const set_filter = (type, value) => {
        dispatch(SetFilter(type, value));
        state_setters[type](false);
    };

    const options = [
        {
            label: 'Priority',
            value: 'priority',
            open: () => set_priorities_visible(true),
        },
        {
            label: 'Tags',
            value: 'tags',
            open: () => set_tags_visible(true),
        },
    ];

    return (
        <div>
            <Select
                styles={customStyles}
                options={options}
                placeholder="Filter"
                isMulti
                value={filters}
                onChange={select_menu}
            />
            <FilterPriority
                on_select={set_filter}
                visible={priorities_visible}
            />
            <FilterTags on_select={set_filter} visible={tags_visible} />;
        </div>
    );
}
