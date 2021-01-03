export const Create = () => {
    return {
        type: "CREATE"
    };
}

export const Delete = (id) => {
    return {
        type: "DELETE",
        id: id
    };
}