export class Contact {
    static contact_dict = {};
    static CURRENT_USER = Contact.create_contact_from_address('');

    static clear_contacts() {
        Contact.contact_dict = {};
    }
    static create_contact(recipient_object, image_link) {
        if (!recipient_object) {
            return Contact.CURRENT_USER;
        }
        const address = recipient_object['emailAddress']['address'];
        var existing_contact = Contact.contact_dict[address];
        if (existing_contact) {
            const name = recipient_object['emailAddress']['name'];
            if (name && !existing_contact.get_name())
                existing_contact.set_name(name);
            return existing_contact;
        } else {
            this.contact_dict[address] = new Contact(
                recipient_object,
                image_link
            );
            return this.contact_dict[address];
        }
    }
    static create_contact_from_address(address) {
        const recipient_object = {
            emailAddress: {
                address: address,
                name: '',
            },
        };
        return Contact.create_contact(recipient_object);
    }
    static get_contact_name_by_address(address) {
        const contact = Contact.contact_dict[address];
        return contact ? contact.get_name() : null;
    }

    static get_filtered_contacts(search_phrase, max_num = 7) {
        if (search_phrase === '') {
            return [];
        }
        const all_contacts = Object.values(Contact.contact_dict);
        try {
            return all_contacts
                .filter(
                    (a) =>
                        a.get_name().search(search_phrase) !== -1 ||
                        a.get_address().search(search_phrase) !== -1
                )
                .slice(0, max_num);
        } catch (err) {
            console.warn(err);
            return [];
        }
    }

    constructor(recipient_object, image_link) {
        this.recipient = recipient_object;
        this.image_link = image_link
            ? image_link
            : 'person_images/' +
              Object.keys(Contact.contact_dict).length +
              '.jpg';
        Contact.contact_dict[this.get_address()] = this;
    }
    get_address() {
        return this.recipient['emailAddress']['address'];
    }

    get_name() {
        const name = this.recipient['emailAddress']['name'];
        return name ? name : this.get_address();
    }

    get_first_name() {
        return this.get_name().split(' ')[0];
    }

    set_name(name) {
        this.recipient['emailAddress']['name'] = name;
    }

    get_icon() {
        return this.image_link;
    }
    equals(other) {
        return this.get_address() === other.get_address();
    }

    get_initials() {
        var initials = '';
        for (const name of this.get_name().split(' ')) {
            initials = initials + name[0] + '.';
        }
        return initials;
    }
}

export const person0 = Contact.create_contact_from_address('');
