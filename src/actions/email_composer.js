export const Create = (attributes) => {
    return {
        type: "CREATE_COMPOSER",
        attributes: attributes
    };
}

export const Delete = (id) => {
    return {
        type: "DELETE_COMPOSER",
        id: id
    };
}