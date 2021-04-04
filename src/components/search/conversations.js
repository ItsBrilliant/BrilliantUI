import { SelectThread } from '../../actions/email_threads'
import { useSearchResultSelect } from '../../hooks/search'
import { useEmails } from '../../hooks/redux'
import { format_date } from '../../utils'
import { SearchResults } from './SearchResults'

export function SearchConversations(props) {
    const emails = useEmails()
    const filter_function = (email, value) =>
        email.get_subject().toLowerCase().includes(value.toLowerCase())
    const select_email = useSearchResultSelect('mail', (email) =>
        SelectThread(email.get_thread_id())
    )
    return (
        <SearchResults
            filter_function={filter_function}
            data={emails}
            top_line={(email) => email.get_subject()}
            bottom_line={(email) =>
                email.get_sender() ? email.get_sender().get_address() : ''
            }
            search_value={props.search_value}
            icon={'button_icons/mail.svg'}
            max_results={5}
            time_stamp={(email) => {
                let timestamp = format_date(email.get_date())
                return timestamp.date + ' ' + timestamp.time
            }}
            my_on_click={select_email}
        ></SearchResults>
    )
}