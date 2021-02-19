import { update_draft } from './Connect.js';
export function mark_read(email_id, is_read) {
    const email =
    {
        message: { isRead: is_read }
    }
    console.log('marking email read');
    update_draft(email_id, email).then(res => console.log(res)).catch(
        err => console.log(`error trying to mark email read: ${err}`));

}

var CALENDER_EVENT_VERSIONS = {};
export function update_event_version(event) {
    const current_version = CALENDER_EVENT_VERSIONS[event.id];
    if (event.changeKey === current_version) {
        return false;
    } else {
        CALENDER_EVENT_VERSIONS[event.id] = event.changeKey;
        return true;
    }
}