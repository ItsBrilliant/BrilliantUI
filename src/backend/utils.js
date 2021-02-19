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


export function update_resource_version(resource, database) {
    const current_version = database[resource.id];
    if (resource.changeKey === current_version) {
        return false;
    } else {
        database[resource.id] = resource.changeKey;
        return true;
    }
}