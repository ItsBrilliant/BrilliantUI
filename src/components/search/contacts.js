export const CONTACT_PROPS = {
    top_line: (contact) => contact.get_name() + `(${contact.get_address()})`,
    bottom_line: () => '',
    icon: 'button_icons/people.svg',
    time_stamp: () => '',
};

export const CONTACT_FILTER_FUNCTION = (contact, search_value) =>
    search_value &&
    (contact.get_name().toLowerCase().includes(search_value.toLowerCase()) ||
        contact
            .get_address()
            .toLowerCase()
            .includes(search_value.toLowerCase()));

export function num_conversations_with_contact(all_threads, contact) {
    let count = 0;
    for (const thread of all_threads) {
        if (thread.get_participants(null).includes(contact)) {
            count++;
        }
    }
    return count;
}

export function num_tasks_with_contact(all_tasks, contact) {
    let count = 0;
    for (const task of all_tasks) {
        if (task.owner === contact) {
            count++;
        }
    }
    return count;
}
