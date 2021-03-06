import { create_calendar_events } from '../components/calendar/utils';

export const EventsReducer = (state = [], action) => {
    if (action.type === 'EXPAND_EVENTS') {
        let new_event_ids = action.events.map((e) => e.id);
        let unchanged_events = state.filter(
            (e) => !new_event_ids.includes(e.id)
        );
        let new_state = [...unchanged_events, ...action.events];
        new_state = create_calendar_events(new_state);
        return new_state;
    } else if (action.type === 'RESET_EVENTS') {
        return [];
    } else if (action.type === 'DELETE_EVENT') {
        return state.filter((e) => e.id !== action.id);
    }

    return state;
};

export const SelectedDateReducer = (
    state = { date: new Date(), view: 'Week' },
    action
) => {
    let new_state = state;
    if (action.type === 'SELECT_DATE') {
        new_state = action.date;
    }
    return new_state;
};
