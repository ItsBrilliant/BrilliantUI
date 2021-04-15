import { useDispatch, useSelector } from 'react-redux';
import { RemoveFilter, SetFilter } from '../../actions/filter';
import OptionsButton from '../OptionsButton';
import SelectedFilters from './SelectedFilters';
import React, { useState } from 'react';
import Select, { components } from 'react-select';
import { main_menu_style } from './Filter.styles';
import { FilterPriority, FilterTags, MyControl } from './FilterPriority';
import { useFilters } from '../../hooks/redux';
import { FilterStyle } from './Filter.styles';
import { PRIORITIES } from '../../data_objects/Consts';

const MenuList = (props) => {
    return (
        <components.MenuList {...props}>{props.children}</components.MenuList>
    );
};

export default function Filter(props) {
    const filters = useFilters().map((f) => ({
        label: f.type === 'priority' ? PRIORITIES[f.value] : f.value,
        filter_type: f.type,
    }));
    const [priorities_visible, set_priorities_visible] = useState(false);
    const [tags_visible, set_tags_visible] = useState(false);
    //  const [menu_is_open, set_menu_open] = useState(false);
    const state_setters = {
        priority: set_priorities_visible,
        tags: set_tags_visible,
    };
    const dispatch = useDispatch();
    const select_menu = (options, action) => {
        if (action.action === 'select-option') {
            for (const type in state_setters) {
                // open the right menua and close all others
                state_setters[type](type === action.option.value);
            }
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
        },
        {
            label: 'Tags',
            value: 'tags',
        },
    ];

    return (
        <FilterStyle>
            <span
                //            onClick={() => set_menu_open(!menu_is_open)}
                className="filter_label"
            >
                Filter
            </span>
            ,
            <Select
                styles={main_menu_style}
                options={options}
                isMulti
                value={filters}
                onChange={select_menu}
                placeholder=""
                closeMenuOnSelect={false}
            />
            <FilterPriority
                on_select={set_filter}
                visible={priorities_visible}
            />
            <FilterTags on_select={set_filter} visible={tags_visible} />;
        </FilterStyle>
    );
}
