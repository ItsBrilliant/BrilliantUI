export const Create = (attributes) => {
    return {
        type: "CREATE",
        attributes: attributes
    };
}

export const Delete = (id) => {
    return {
        type: "DELETE",
        id: id
    };
}