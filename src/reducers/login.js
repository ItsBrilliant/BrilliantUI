
export const LoginReducer = (state, action) => {
    if (action.type === "LOGIN") {
        return action.contact;
    } else {
        return null;
    }
}

