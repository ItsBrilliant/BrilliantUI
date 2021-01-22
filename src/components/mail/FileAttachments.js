import { get_file_icon } from '../../utils.js';
import { download_attachment } from '../../backend/Connect.js';
import { useSelector } from 'react-redux';
import './FileAttachments.css'

export function FileAttachments(attachments) {
    if (attachments.length === 0) {
        return null;
    }
    const attachemnts_for_display = attachments.map(a => <AttachmentDisplay attachment={a} />);
    return (
        <div className="Container">
            <h4>Attached Files</h4>
            <div className='AttachmentsDisplay'>
                {attachemnts_for_display}
            </div>
        </div>
    )
}

export function AttachmentDisplay(props) {
    const user = useSelector(state => state.user);
    const file_name = props.attachment.name;
    const splitted = file_name.split('.');
    var extension = splitted[splitted.length - 1];
    const icon = get_file_icon(extension);
    return (
        <div className='TitledImage'
            onClick={() => download_attachment(props.attachment.email_id, props.attachment.id, user)}
        >
            <img src={icon} title="download"></img>
            <p>{file_name}</p>
        </div>
    )
}
