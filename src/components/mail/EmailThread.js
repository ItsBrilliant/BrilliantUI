import React, { Component } from 'react';
import './EmailThread.css';
import { Menu } from '../external/Menues.js';
import { AddTaskPortal } from '../AddTaskPortal.js';
import { Task } from '../../data_objects/Task.js';
import { URGENT } from '../../data_objects/Consts.js';
import OptionsButton from '../OptionsButton.js';
import { mark_all_read, get_thread } from '../../data_objects/Thread.js'
import EmailTextArea from './EmailTextArea.js';
import { EmailStamp } from './EmailStamp.js';

class EmailThread extends Component {

    get_selected_email() {
        return this.props.thread.get_emails()[0];
    }

    get_style() {
        var style = 'emailThread';
        if (this.props.is_selected) {
            style = style + ' selected_thread';
        }

        if (this.has_unread()) {
            style = style + ' unread';
        }
        return style
        //return this.props.is_selected ? 'emailThread selected_thread' : 'emailThread';
    }

    get_receiver_icons() {
        var receiver_icons = []
        for (const receiver of this.get_selected_email().receivers) {
            receiver_icons.push(receiver.image_link)
        }
        return receiver_icons;
    }
    get_has_attachments() {
        for (const email of this.props.thread.get_emails()) {
            if (email.get_attachments_names().length > 0) {
                return true;
            }
        }
        return false;
    }

    has_unread() {
        for (const email of this.props.thread.get_emails()) {
            if (!email.get_is_read()) {
                return true;
            }
        }
        return false;
    }

    get_num_unread() {
        var count = 0
        for (const email of this.props.thread.emails) {
            if (!email.get_is_read()) {
                count++;
            }
        }
        return count;
    }
    render() {
        const num_tasks = this.props.thread.get_num_tasks()
        //const num_unread_emails = this.get_num_unread()
        //        const receiver_icons = this.get_receiver_icons();
        const selected_email = this.get_selected_email();
        const has_attatchments = this.get_has_attachments();
        const sender = selected_email.get_sender();
        const stamp = sender ? EmailStamp([sender.get_icon()], selected_email.date, sender.get_name()) : null;
        return (
            <div className={this.get_style()} onClick={() => this.props.handle_select(this.props.id)}>
                {stamp}
                <EmailTextArea isUnread={this.has_unread()}
                    content={selected_email.get_text()}
                    subject={selected_email.get_subject()}
                    tags={selected_email.get_tags()} />
                {ThreadLabels(num_tasks, has_attatchments, this.props.priority, this.props.id)}
            </div>
        )
    }
}

function ThreadLabels(num_threads, has_attachments, priority, thread_id) {
    const option_names = ["Set as task", "Change priority", "Add tag", "Export", "Mark as read", "Delete"];
    const options = option_names.map(n => { return { name: n } });
    // options.filter(o => o.name === 'Delete')[0].action = () => delete_thread(thread_id);
    options.filter(o => o.name === 'Mark as read')[0].action = () => mark_all_read(thread_id);
    const thread = get_thread(thread_id);
    const new_priority = (thread.get_priority() + 1) % 3
    options.filter(o => o.name === "Change priority")[0].action = () => thread.set_priority(new_priority);
    return (
        <div className='thread_labels'>
            <div className={'num_threads_label ' + priority}>
                {num_threads}
                {has_attachments ? attachmentIcon() : null}
            </div>
            <OptionsButton options={options}></OptionsButton>
        </div>
    )
}

export function attachmentIcon() {
    return <img className='attachment' src='file_icons/attachment.png' />
}

export { EmailThread };