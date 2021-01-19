
export const EmailComposerReducer = (state = { ids: [], attributes: {} }, action) => {

    if (action.type === "CREATE") {
        const new_id = state.ids.length > 0 ? Math.max(...state.ids) + 1 : 0;
        var new_composer_ids = [...state.ids, new_id];
        var new_attributes = Object.assign({}, state.attributes)
        new_attributes[new_id] = action.attributes;
    }

    else if (action.type === "DELETE") {
        var new_composer_ids = [...state.ids];
        new_composer_ids.splice(new_composer_ids.indexOf(action.id), 1);
        var new_attributes = Object.assign({}, state.attributes);
        new_attributes[action.id] = undefined;
    }

    else {
        return state;
    }

    return { ids: new_composer_ids, attributes: new_attributes };
}


