export const SetFilter = (filter_type, filter_value) => {
    return {
        type: 'SET_FILTER',
        payload: { [filter_type]: filter_value },
    };
};

export const RemoveFilter = (filter) => {
    return {
        type: 'REMOVE_FILTER',
        filter_type: filter.type,
        filter_value: filter.value,
    };
};
