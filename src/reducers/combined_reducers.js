import { combineReducers } from 'redux';
import { LoginReducer } from './login.js';
import { EmailComposerReducer } from './email_composer.js';
import { EventsReducer, SelectedDateReducer } from './events_reducer';
import { EmailThreadsReducer, SelectedThreadReducer } from './email_threads.js';
import { SelectedTaskReducer, TasksReducer } from './tasks.js';
import { SearchReducer } from './search.js';
import { FilterReducer } from './filter.js';

export const CombinedReducers = combineReducers({
    user: LoginReducer,
    email_composers: EmailComposerReducer,
    email_threads: EmailThreadsReducer,
    selected_thread_id: SelectedThreadReducer,
    selected_task_id: SelectedTaskReducer,
    selected_calendar_date: SelectedDateReducer,
    tasks: TasksReducer,
    events: EventsReducer,
    searches: SearchReducer,
    filters: FilterReducer,
});
