import { SearchResults } from './SearchResults';
import { Contact } from '../../data_objects/Contact';

export function SearchContacts(props) {
    const filter_function = (a, b) => true;
    const contact_time_stamp = (contact) => '';
    const select_contact = () => {};
    const filtred_contacts = Contact.get_filtered_contacts(
        props.search_value,
        5
    );
    return (
        <SearchResults
            filter_function={filter_function}
            data={filtred_contacts}
            top_line={(contact) =>
                contact.get_name() + `(${contact.get_address()})`
            }
            bottom_line={() => ''}
            search_value={props.search_value}
            icon={'button_icons/people.svg'}
            max_results={5}
            time_stamp={contact_time_stamp}
            my_on_click={select_contact}
        ></SearchResults>
    );
}
