import { Contact, person0 } from '../data_objects/Contact.js';
export const LoginReducer = (
    state = { contact: person0, prefered_email_time: 13 },
    action
) => {
    if (action.type === 'LOGIN') {
        Contact.CURRENT_USER = action.contact;
        let new_state = {
            contact: action.contact,
            prefered_email_time: action.prefered_email_time,
        };
        return new_state;
    } else {
        return state;
    }
};
