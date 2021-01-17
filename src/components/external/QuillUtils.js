import { Fragment } from 'react';
import { get_file_icon } from '../../utils.js';
import './QuillUtils.css'


export function ComposerAttachments(props) {
    const attachments = props.files.map(f =>
        <ComposerAttachment file={f} on_delete={props.on_delete}
            progress={props.file_progress[f.name]} />
    )
    return (
        <div className='ComposerAttachments'>
            {attachments}
        </div>
    );
}

function ComposerAttachment(props) {
    const file_name = props.file.name;
    const splitted = file_name.split('.');
    var extension = splitted[splitted.length - 1];
    const icon = get_file_icon(extension);
    var progress_style = { width: `${props.progress}%` };
    //  if (props.progress === 100) {
    //     progress_style.backgroundColor = 'green';
    //  }
    return (
        <div className="ComposerAttachment_outer">
            <div className='ComposerAttachment'>
                <img title={file_name} className="attachment_icon" src={icon}></img>
                <span className="file_name">{file_name}</span>
                <span className="progress">{props.progress}%</span>
                <button className="delete_button" onClick={() => props.on_delete(props.file)}>&times;</button>
            </div>
            <div className='upload_progress' style={progress_style} ></div>
        </div>

    );
}