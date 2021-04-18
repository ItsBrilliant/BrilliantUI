import axios from 'axios';
import { Contact } from '../data_objects/Contact';

export const Login = (user_account, prefered_email_time) => {
    return {
        type: 'LOGIN',
        contact: user_account,
        prefered_email_time: prefered_email_time,
    };
};

export const FullLogin = () => (dispatch) => {
    axios.get('api/me').then((res) => {
        if (res.data) {
            console.log('Recieved user data ' + res.data);
            Contact.clear_contacts();
            const new_user_contact = Contact.create_contact_from_address(
                res.data.address
            );
            dispatch(Login(new_user_contact, res.data.email_time_preference));
            return Promise.resolve();
        } else {
            console.log(
                "Can't complete 'FullLogin' because server didn't return user info"
            );
            // Not sure why but this doesn't work as expected. Currently doesn't matter
            return Promise.reject();
        }
    });
};
