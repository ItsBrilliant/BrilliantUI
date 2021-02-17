import React, { Component } from 'react';
import './GroupedThreads.css';
import EmailThread from "./EmailThread.js";
import { PRIORITIES, URGENT, IMPORTANT, CAN_WAIT, PRIORITY_KEY, TIME_KEY } from "../../data_objects/Consts.js";
import { format_date } from '../../utils';

class GroupedThreads extends Component {

    create_title() {
        const num_threads = this.props.emailThreads.length;
        return this.get_key_display() + " (" + num_threads + ")";
    }

    get_key_display() {
        if (this.props.group_key_type === PRIORITY_KEY) {
            return PRIORITIES[this.props.group_key];
        }
        else if (this.props.group_key_type === TIME_KEY) {
            var date = format_date(new Date(this.props.group_key));
            return date.date;
        }
        return undefined;
    }
    get_priority_style(priority_code) {
        if (priority_code == URGENT) {
            return "Urgent";
        }
        else if (priority_code == IMPORTANT) {
            return "Important";
        }
        else if (priority_code == CAN_WAIT) {
            return "CanWait";
        }
    }
    get_group_key_style() {
        if (this.props.group_key_type === PRIORITY_KEY) {
            return "group_button " + this.get_priority_style(this.props.group_key);
        }

        return "group_button Default";
    }

    render() {
        const title = this.create_title()
        const threads = this.props.emailThreads.map((thread) =>
            <EmailThread key={thread.get_id()} id={thread.get_id()} thread={thread} is_selected={thread.get_id() === this.props.selected_thread_id}
                handle_select={this.props.handle_select}
                priority={this.get_priority_style(thread.get_priority(this.props.tasks))}
                options_offset={{ top: 0, left: 15 }}
                selected_folder_id={this.props.selected_folder_id} />);
        return (
            <div className='GroupedThreads'>
                <button className={this.get_group_key_style()}>{title}</button>
                {threads}
            </div>
        );
    }
}

export { GroupedThreads };