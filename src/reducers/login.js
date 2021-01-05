
export const LoginReducer = (state = null, action) => {
    if (action.type === "LOGIN") {
        return action.contact;
    } else {
        return state;
    }
}

