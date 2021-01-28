import { Contact } from '../data_objects/Contact.js'
export const LoginReducer = (state = null, action) => {
    if (action.type === "LOGIN") {
        Contact.CURRENT_USER = action.contact;
        return action.contact;
    } else {
        return state;
    }
}

