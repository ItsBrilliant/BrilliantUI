import React, { Component } from 'react';
import './EmailThread.css';
import { format_date } from '../../utils.js';
import { Menu } from '../external/Menues.js'

class EmailThread extends Component {

    get_selected_email() {
        return this.props.thread.get_emails()[0]
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
        for (const email of this.props.thread.get_emails()) {
            if (email.attachments !== undefined && email.attachments.length > 0) {
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
        const sender_full_name = selected_email.get_sender().get_name();
        return (
            <button className='thread_button' onClick={() => this.props.handle_select(this.props.id)}>
                <div className={this.get_style()}>
                    {EmailStamp([selected_email.get_sender().get_icon()], selected_email.date, sender_full_name)}
                    <EmailTextArea isUnread={this.has_unread()}
                        content={selected_email.get_text()}
                        subject={selected_email.get_subject()}
                        tags={selected_email.get_tags()} />
                    {ThreadLabels(num_tasks, has_attatchments, this.props.priority)}
                </div>
            </button>
        )
    }
}

export class EmailTextArea extends Component {
    constructor(props) {
        super(props);
        this.state = { add_task_icon: null };
    }
    handle_mouse_up(e) {
        const selection = window.getSelection();
        if (this.props.of_center_email && selection && selection.rangeCount > 0) {
            //Text was selected, and it happend in the center email display (not left thread display)

            const range = selection.getRangeAt(0);
            const start_grand_parent = range.startContainer.parentElement.parentElement;
            const end_grand_parent = range.endContainer.parentElement.parentElement;
            if (start_grand_parent === end_grand_parent &&
                start_grand_parent.className === "span_text_area" &&
                range.startOffset < range.endOffset) {
                console.log("valid");
                console.log(range.startOffset + "," + range.endOffset);
                return (
                    <img className="manual_add_task" src='button_icons/task.svg'
                        style={{
                            position: 'fixed',
                            top: e.pageY - 60,
                            left: e.pageX - 20,
                        }}
                        onClick={() => alert("dov")}></img>
                );
            }
        }
        return null;
    }

    get_style() {
        var style = 'email_text_area';
        if (this.props.isUnread) {
            style = style + ' unread';
        }
        if (this.props.of_center_email) {
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
    // Insert task highligts
    render_content(text) {
        if (!this.props.tasks || this.props.tasks.length == 0) {
            return <span>{text}</span>
        }
        var sections = []
        const first_highlight = this.props.tasks[0].get_source_indexes()
        if (first_highlight && first_highlight.start > 0) {
            sections.push(<span>{text.slice(0, first_highlight.start)}</span>)
        }
        for (let i = 0; i < this.props.tasks.length; i++) {
            const start = this.props.tasks[i].get_source_indexes().start
            const end = this.props.tasks[i].get_source_indexes().end
            var style = 'task_source'
            if (this.props.tasks[i] === this.props.selected_task) {
                style += ' selected_task'
            }
            sections.push(
                <span className={style}>
                    {text.slice(start, end)}
                </span>)
            const next_start = i + 1 < this.props.tasks.length ? this.props.tasks[i + 1].get_source_indexes().start : text.length;
            if (next_start > end) {
                sections.push(
                    <span>
                        {text.slice(end, next_start)}
                    </span>)
            }
        }
        return sections;
    }
    render() {
        const subject = this.props.subject;
        const content = this.props.is_html ? this.props.content : this.render_content(this.props.content);
        return (
            <div className={this.get_style()}>
                {this.get_email_options_button()}
                <h4>{subject + this.get_tags()}</h4>
                <div className="span_text_area" onMouseUpCapture={(e) => this.setState({ add_task_icon: this.handle_mouse_up(e) })}>
                    {content}
                </div>
                {this.state.add_task_icon}
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
        <div className='TimeStamp'>
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