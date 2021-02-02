import { combineReducers } from 'redux';
import { LoginReducer } from './login.js';
import { EmailComposerReducer } from './email_composer.js';
import { EmailThreadsReducer } from './email_threads.js';
import { TasksReducer } from './tasks.js';

export const CombinedReducers = combineReducers({
    user: LoginReducer,
    email_composers: EmailComposerReducer,
    email_threads: EmailThreadsReducer,
    tasks: TasksReducer
})