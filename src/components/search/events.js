import { useSearchResultSelect } from '../../hooks/search';
import { SelectCalendarDate } from '../../actions/events';
import { format_date } from '../../utils';
import { SearchResults } from './SearchResults';
import { useSelector } from 'react-redux';

export function SearchEvents(props) {
    const events = useSelector((state) => state.events);
    const filter_function = (event, value) =>
        event.subject.toLowerCase().includes(value.toLowerCase());
    const event_time_stamp = (event) => {
        let start = format_date(event.start);
        let end = format_date(event.end);
        return `${start.date} ${start.time} - ${end.time}`;
    };
    const select_event = useSearchResultSelect('calendar', (event) =>
        SelectCalendarDate({ date: event.start, view: 'Day' })
    );
    return (
        <SearchResults
            filter_function={filter_function}
            data={events}
            top_line={(event) => event.subject}
            bottom_line={(event) =>
                event.orginizer ? event.orginizer.get_address() : ''
            }
            search_value={props.search_value}
            icon={'button_icons/calendar.svg'}
            max_results={5}
            time_stamp={event_time_stamp}
            my_on_click={select_event}
        ></SearchResults>
    );
}
