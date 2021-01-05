
export const EmailComposerReducer = (state = [], action) => {

    if (action.type === "CREATE") {
        const new_id = state.length > 0 ? Math.max(...state) + 1 : 0;
        var new_composers = [...state, new_id];
    }

    else if (action.type === "DELETE") {
        var new_composers = [...state];
        new_composers.splice(new_composers.indexOf(action.id), 1);
    }

    else {
        return state;
    }

    return new_composers;
}


