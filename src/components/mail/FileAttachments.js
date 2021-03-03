import { get_file_icon } from '../../utils.js';
import { download_attachment } from '../../backend/Connect.js';
import GoogleDocsViewer from 'react-google-docs-viewer'
import './FileAttachments.css'
import React, { useState } from 'react'

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
    const [preview_visible, set_visible] = useState(false);
    const file_name = props.attachment.name;
    const splitted = file_name.split('.');
    var extension = splitted[splitted.length - 1];
    const icon = get_file_icon(extension);
    const preview_attachment = () => {
        set_visible(true);
        const url = download_attachment(props.attachment.email_id, props.attachment.id, true);
    }
    return (
        <div className='TitledImage'
            onClick={() => download_attachment(props.attachment.email_id, props.attachment.id)}
        >
            <img src={icon} title="download"></img>
            <p>{file_name}</p>
        </div>
    )
}
//            onClick={() => download_attachment(props.attachment.email_id, props.attachment.id)}
function AttachmentPreview(props) {
    if (!props.visible) {
        return null;
    }
    const position_style =
    {
        position: 'fixed',
        top: "0px",
        left: "0px"
    };
    return (
        <div style={position_style} >
            <button onClick={props.on_close}>Close</button>
            <GoogleDocsViewer
                width="600px"
                height="780px"
                fileUrl="docs/doc1.docx"
            />
        </div>
    )
}
