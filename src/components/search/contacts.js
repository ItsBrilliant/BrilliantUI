export const CONTACT_PROPS = {
    top_line: (contact) => contact.get_name() + `(${contact.get_address()})`,
    bottom_line: () => '',
    icon: 'button_icons/people.svg',
    time_stamp: () => '',
};

export const CONTACT_FILTER_FUNCTION = (contact, search_value) =>
    contact.get_name().toLowerCase().includes(search_value.toLowerCase()) ||
    contact.get_address().toLowerCase().includes(search_value.toLowerCase());
