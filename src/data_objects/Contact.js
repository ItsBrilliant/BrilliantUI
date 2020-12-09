export default class Contact {
    constructor(recipient_object, image_link) {
        this.recipient = recipient_object;
        this.image_link = image_link;
    }
    get_address() {
        return this.recipient['emailAddress']['address'];
    }

    get_name() {
        return this.recipient['emailAddress']['name'];
    }

    get_icon() {
        return this.image_link;
    }
}