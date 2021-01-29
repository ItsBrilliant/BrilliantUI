import { CONTACT_KEY } from '../data_objects/Consts.js';
import { Contact, person0 } from '../data_objects/Contact.js'
export const LoginReducer = (state = person0, action) => {
    if (action.type === "LOGIN") {
        Contact.CURRENT_USER = action.contact;
        return action.contact;
    } else {
        return state;
    }
}

