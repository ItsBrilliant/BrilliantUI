export const EmailComposerReducer = (
    state = { ids: [], attributes: {} },
    action
) => {
    var new_composer_ids, new_attributes;
    if (action.type === 'CREATE_COMPOSER') {
        const new_id = state.ids.length > 0 ? Math.max(...state.ids) + 1 : 0;
        new_composer_ids = [...state.ids, new_id];
        new_attributes = Object.assign({}, state.attributes);
        new_attributes[new_id] = action.attributes;
    } else if (action.type === 'DELETE_COMPOSER') {
        new_composer_ids = [...state.ids];
        new_composer_ids.splice(new_composer_ids.indexOf(action.id), 1);
        new_attributes = Object.assign({}, state.attributes);
        new_attributes[action.id] = undefined;
    } else {
        return state;
    }

    return { ids: new_composer_ids, attributes: new_attributes };
};
