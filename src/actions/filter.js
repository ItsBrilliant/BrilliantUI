export const SetFilter = (filter_type, filter_value) => {
    return {
        type: 'SET_FILTER',
        payload: { [filter_type]: filter_value },
    };
};

export const RemoveFilter = (filter_type) => {
    return {
        type: 'REMOVE_FILTER',
        payload: filter_type,
    };
};
