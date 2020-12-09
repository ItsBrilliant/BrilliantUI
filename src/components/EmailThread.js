import React, { Component } from 'react';
import './EmailThread.css';
import { merge_icons, format_date } from '../utils.js';
import { Menu } from './Menues.js'

class EmailThread extends Component {

    get_selected_email() {
        return this.props.thread.emails[0]
    }

    get_style() {
        var style = 'emailThread';
        if (this.props.is_selected) {
            style = style + ' selected_thread';
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
        for (const email of this.props.thread.emails) {
            if (email.attachments !== undefined && email.attachments.length > 0) {
                return true;
            }
        }
        return false;
    }

    has_unread() {
        for (const email of this.props.thread.emails) {
            if (email.isUnread) {
                return true;
            }
        }
        return false;
    }

    get_num_unread() {
        var count = 0
        for (const email of this.props.thread.emails) {
            if (email.isUnread) {
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
        const sender_full_name = selected_email.sender.first_name + " " + selected_email.sender.last_name;
        return (
            <div>
                <button onClick={() => this.props.handle_select(this.props.id)}>
                    <div className={this.get_style()}>
                        {EmailStamp([selected_email.sender.image_link], selected_email.date, sender_full_name)}
                        <EmailTextArea isUnread={this.has_unread()} content={selected_email.content} tags={selected_email.tags} />
                        {ThreadLabels(num_tasks, has_attatchments, this.props.priority)}
                    </div>
                </button>
            </div>
        )
    }
}

export class EmailTextArea extends Component {
    get_style() {
        var style = 'email_text_area';
        if (this.props.isUnread) {
            style = style + ' unread';
        }
        if (this.props.overflow) {
            style = style + ' adjust_height_to_text';
        }
        return style;
    }

    get_tags() {
        if (this.props.tags === undefined) {
            return "";

        } else {
            var all_tags = "";
            for (const tag of this.props.tags)
                all_tags = all_tags + " [" + tag + "]";
            return all_tags;
        }
    }

    get_email_options_button() {
        if (this.props.options_button) {
            return (
                <div className='EmailOptionsButton'>
                    <Menu
                        options={['Delete', 'Reply', 'Add Task', 'Mark Read']}
                        label=''
                        value={this.props.options_button.selected_value}
                        onChange={(e) => this.props.options_button.onChange(e, this.props.id)} />
                </div>
            );
        }
        else {
            return null;
        }
    }
    render() {
        const subject = this.props.content.subject;
        const text = this.props.content.text;
        return (
            <div className={this.get_style()}>
                {this.get_email_options_button()}
                <h4>{subject + this.get_tags()}</h4>
                <p>{text}</p>
            </div>
        );
    }
}

function ThreadLabels(num_threads, has_attachments, priority) {
    return (
        <div className='thread_labels'>
            <div className={'num_threads_label ' + priority}>
                {num_threads}
            </div>
            <div>
                {has_attachments ? attachmentIcon() : null}
            </div>
        </div>
    )
}

export function attachmentIcon() {
    return <img className='attachment' src='file_icons/attachment.png' />
}

export function TimeStamp(date) {
    const formatted_date = format_date(date)
    return (
        <div>
            <p>{formatted_date.time}</p>
            <p>{formatted_date.date}</p>
        </div>
    );
}

export function EmailStamp(icons, date, name) {
    return (
        <div className='emailStamp'>
            <h4>{name}</h4>
            {GroupIcon(icons)}
            {TimeStamp(date)}
        </div>
    )
}

export function GroupIcon(icons) {
    const MAX_ICONS = 3;
    const merged = icons.slice(0, MAX_ICONS).map((icon) => <img className='threadIcon' src={icon}></img>);
    var extra_icons = icons.length - MAX_ICONS;
    const plus = extra_icons > 0 ? <h1 className="threadIcon">{"+" + extra_icons}</h1> : null;
    return (
        <div className="GroupIcon">{merged} {plus}</div>
    );
}

export { EmailThread };