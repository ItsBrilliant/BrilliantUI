import { combineReducers } from "redux";
import { LoginReducer } from "./login.js";
import { EmailComposerReducer } from "./email_composer.js";
import { EventsReducer } from "./events_reducer";
import { EmailThreadsReducer, SelectedThreadReducer } from "./email_threads.js";
import { TasksReducer } from "./tasks.js";

export const CombinedReducers = combineReducers({
  user: LoginReducer,
  email_composers: EmailComposerReducer,
  email_threads: EmailThreadsReducer,
  selected_thread_id: SelectedThreadReducer,
  tasks: TasksReducer,
  events: EventsReducer,
});
