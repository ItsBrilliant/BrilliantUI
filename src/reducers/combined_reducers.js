import { combineReducers } from 'redux';
import { LoginReducer } from './login.js';

export const CombinedReducers = combineReducers({
    login: LoginReducer
})