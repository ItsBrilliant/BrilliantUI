const SEARCH_HISTORY_LENGTH = 10;

export const SearchReducer = (state = [], action) => {
    if (action.type === 'APPLY_SEARCH') {
        let new_state = [
            ...state.filter((v) => v !== action.value),
            action.value,
        ];
        if (new_state.length > SEARCH_HISTORY_LENGTH) {
            new_state.shift();
        }
        return new_state;
    } else {
        return state;
    }
};
