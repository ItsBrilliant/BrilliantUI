import { combineReducers } from 'redux';
import { LoginReducer } from './login.js';
import { EmailComposerReducer } from './email_composer.js';

export const CombinedReducers = combineReducers({
    login: LoginReducer,
    email_composers: EmailComposerReducer
})