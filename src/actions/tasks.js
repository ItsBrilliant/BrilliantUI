export const Update = (task) => {
    return {
        type: "UPDATE",
        task: task
    };
}

export const Delete = (id) => {
    return {
        type: "DELETE",
        id: id
    };
}