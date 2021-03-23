import { create_calendar_events } from "../components/calendar/utils";

export const EventsReducer = (state = [], action) => {
  if (action.type === "EXPAND_EVENTS") {
    let new_event_ids = action.events.map((e) => e.id);
    let unchanged_events = state.filter((e) => !new_event_ids.includes(e.id));
    let new_state = [...unchanged_events, ...action.events];
    new_state = create_calendar_events(new_state);
    return new_state;
  } else if (action.type === "RESET_EVENTS") {
    return [];
  }

  return state;
};
