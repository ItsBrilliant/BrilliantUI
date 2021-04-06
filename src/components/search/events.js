import { SelectCalendarDate } from '../../actions/events';
import { format_date } from '../../utils';

const event_time_stamp = (event) => {
    let start = format_date(event.start);
    let end = format_date(event.end);
    return `${start.date} ${start.time} - ${end.time}`;
};

export const EVENT_PROPS = {
    top_line: (event) => event.subject,
    bottom_line: (event) =>
        event.orginizer ? event.orginizer.get_address() : '',
    icon: 'button_icons/calendar.svg',
    time_stamp: event_time_stamp,
    url: 'calendar',
    action: (event) => SelectCalendarDate({ date: event.start, view: 'Day' }),
};

export const EVENT_FILTER_FUNCTION = (event, search_value) =>
    event.subject.toLowerCase().includes(search_value.toLowerCase());
