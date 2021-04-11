export const FilterReducer = (state = {}, action) => {
    if (action.type === 'SET_FILTER') {
        let new_state = Object.assign(state, action.payload);
        return new_state;
    } else if (action.type === 'REMOVE_FILTER') {
        let new_state = {};
        for (const key in state) {
            if (key !== action.payload) {
                new_state[key] = state[key];
            }
        }
        return new_state;
    } else {
        return state;
    }
};
