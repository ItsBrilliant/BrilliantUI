
export const EmailComposerReducer = (state = [], action) => {
    if (action.type === "CREATE") {
        const new_id = state.length > 0 ? Math.max(...state) + 1 : 0;
        const new_state = [...state, new_id];
        return new_state;
    }
    else if (action.type === "DELETE") {
        const new_state = [...state];
        new_state.splice(new_state.indexOf(action.id), 1);
        return new_state;
    }

    else {
        return state;
    }
}


