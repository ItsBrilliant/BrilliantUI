import { connect } from "react-redux"
import { update_draft } from './Connect.js';
export function mark_read(email_id) {
    const email =
    {
        message: { isRead: true }
    }
    console.log('marking email read');
    update_draft(email_id, email).then(res => console.log(res)).catch(
        err => console.log(`error trying to mark email read: ${err}`));

}