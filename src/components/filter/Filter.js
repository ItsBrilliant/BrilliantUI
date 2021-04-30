import { useDispatch, useSelector } from 'react-redux';
import { RemoveFilter, SetFilter } from '../../actions/filter';
import OptionsButton from '../misc/OptionsButton';
import SelectedFilters from './SelectedFilters';
import React, { useState } from 'react';
import Select, { components } from 'react-select';
import { main_menu_style } from './Filter.styles';
import { FilterPriority, FilterTags, FilterContacts } from './FilterSubMenu';
import { useFilters } from '../../hooks/redux';
import { FilterStyle } from './Filter.styles';
import { PRIORITIES } from '../../data_objects/Consts';
import { FILTER_NAMES } from './Consts';
import { UserIcon, FilterIcon, PriorityIcon, TagIcon } from '../misc/svg_icons';
import IconLabel from '../misc/IconLabel';
import { main_text_color } from '../misc/StyleConsts';

const MenuList = (props) => {
    return (
        <components.MenuList {...props}>{props.children}</components.MenuList>
    );
};

export default function Filter(props) {
    const filters = useFilters().map((f) => ({
        label: get_filter_display_name(f.type, f.value),
        filter_type: f.type,
    }));
    const [selected_sub_menu, set_sub_menu] = useState(null);
    const [main_menu_open, set_main_menu] = useState(false);

    const dispatch = useDispatch();
    const select_menu = (options, action) => {
        if (action.action === 'select-option') {
            set_sub_menu(action.option.value);
        } else if (action.action === 'remove-value') {
            dispatch(RemoveFilter({ type: action.removedValue.filter_type }));
        }
    };
    const set_filter = (type, value) => {
        dispatch(SetFilter(type, value));
        set_sub_menu(null);
        set_main_menu(false);
    };

    const toggle_main_menu = () => {
        set_sub_menu(null);
        set_main_menu(!main_menu_open);
    };

    const options = [
        {
            label: 'Priority',
            value: FILTER_NAMES.priority,
        },
        {
            label: 'Tag',
            value: FILTER_NAMES.tag,
        },
        {
            label: 'Contact',
            value: FILTER_NAMES.contact,
        },
    ];

    return (
        <FilterStyle>
            <span onClick={toggle_main_menu} className="filter_label">
                <FilterIcon />
                <span className="text">Filter</span>
            </span>
            ,
            <Select
                styles={main_menu_style}
                options={options}
                isMulti
                value={filters}
                onChange={select_menu}
                placeholder=""
                menuIsOpen={main_menu_open}
                closeMenuOnSelect={false}
                components={{ MultiValueLabel }}
            />
            <FilterPriority
                on_select={set_filter}
                visible={selected_sub_menu === FILTER_NAMES.priority}
            />
            <FilterTags
                on_select={set_filter}
                visible={selected_sub_menu === FILTER_NAMES.tag}
            />
            <FilterContacts
                on_select={set_filter}
                visible={selected_sub_menu === FILTER_NAMES.contact}
            />
            ;
        </FilterStyle>
    );
}

function get_filter_display_name(filter_type, filter_value) {
    if (filter_type === FILTER_NAMES.priority) {
        return PRIORITIES[filter_value];
    } else if (filter_type === FILTER_NAMES.contact) {
        return filter_value.get_name();
    } else {
        return filter_value;
    }
}

const MultiValueLabel = (props) => {
    let color = main_text_color;
    if (props.data.filter_type === FILTER_NAMES.priority) {
        color = { Urgent: 'red', Important: 'orange', ['Can Wait']: 'green' }[
            props.data.label
        ];
    } else if (props.data.filter_type === FILTER_NAMES.tag) {
        color = 'purple';
    } else {
        color = 'blue';
    }
    const icons_map = {
        [FILTER_NAMES.priority]: PriorityIcon,
        [FILTER_NAMES.contact]: UserIcon,
        [FILTER_NAMES.tag]: TagIcon,
    };
    return (
        <IconLabel
            color={color}
            label={props.data.label}
            icon={icons_map[props.data.filter_type]({ color: color })}
        />
    );
};
