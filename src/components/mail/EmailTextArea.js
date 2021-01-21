import React, { Component } from 'react'
import { Menu } from '../external/Menues.js';
import { AddTaskPortal } from '../AddTaskPortal.js';
import { Task } from '../../data_objects/Task.js';
import { URGENT } from '../../data_objects/Consts.js';
import { getSelectionOffsetRelativeTo, get_priority_style } from '../../utils.js';
import { GroupIcon } from './EmailStamp.js';

export default class EmailTextArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            add_task_icon: null,
            add_task_component: null,
            task_args: null
        };
        this.handle_task_component_close = this.handle_task_component_close.bind(this)
        this.handle_add_task = this.handle_add_task.bind(this)

    }
    handle_task_component_close() {
        this.setState({ add_task_component: null });
    }
    handle_add_task(text, date, priority, owner) {
        this.handle_task_component_close();
        const task_args = this.state.task_args;
        const task_format_indexes = {
            start: task_args.selection_indexes[0],
            end: task_args.selection_indexes[1]
        }
        const task = new Task(text, date, priority, false, task_format_indexes, owner);
        this.props.add_task(task);

    }

    handle_task_icon_click(position_style, selection_indexes) {
        this.setState(
            {
                add_task_icon: null,
                add_task_component: <AddTaskPortal style={position_style}
                    handle_ok={this.handle_add_task}
                    handle_close={this.handle_task_component_close}
                />,
                task_args: {
                    selection_indexes: selection_indexes,
                    text: "",
                    date: new Date(),
                    priority: URGENT
                }
            }
        );
    }
    handle_mouse_up(e) {
        const selection = window.getSelection();
        if (this.props.of_center_email && selection && selection.rangeCount > 0) {
            //Text was selected, and it happend in the center email display (not left thread display)

            const range = selection.getRangeAt(0);
            const start_parent = range.startContainer.parentElement
            const start_grand_parent = start_parent.parentElement;
            const end_grand_parent = range.endContainer.parentElement.parentElement;
            if (start_grand_parent === end_grand_parent &&
                start_grand_parent.className === "span_text_area" &&
                range.startOffset < range.endOffset) {
                const siblings_offset = getSelectionOffsetRelativeTo(start_grand_parent, start_parent);
                const startOffset = range.startOffset + siblings_offset;
                const endOffset = range.endOffset + siblings_offset;
                const top_offset = e.pageY - 60;
                const left_offset = e.pageX - 20
                const position_style = {
                    position: 'fixed',
                    top: top_offset,
                    left: left_offset,
                };
                return (
                    <img className="manual_add_task" src='button_icons/task.svg'
                        style={position_style}
                        onClick={() => this.handle_task_icon_click(position_style,
                            [startOffset, endOffset])}>
                    </img>
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
        const tasks = this.props.tasks.sort(function (a, b) { return a.get_source_indexes().start - b.get_source_indexes().start; });
        const first_highlight = tasks[0].get_source_indexes()
        if (first_highlight && first_highlight.start > 0) {
            sections.push(<span>{text.slice(0, first_highlight.start)}</span>)
        }
        for (let i = 0; i < tasks.length; i++) {
            const start = tasks[i].get_source_indexes().start
            const end = tasks[i].get_source_indexes().end
            var style = 'task_source'
            if (tasks[i] === this.props.selected_task) {
                style += ' selected_task'
            }
            sections.push(
                <span className={style}>
                    {text.slice(start, end)}
                </span>)
            const next_start = i + 1 < tasks.length ? tasks[i + 1].get_source_indexes().start : text.length;
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
        const priority_style = get_priority_style(this.props.priority);

        const header = this.props.of_center_email ?
            <div className="header">
                <h4>{this.props.sender_name}</h4>
                <div className="GroupIconWrapper">
                    {GroupIcon(this.props.contacts)}
                    <div className={"email_priority " + priority_style} />
                </div>
            </div> : null;
        // {this.get_email_options_button()}
        return (
            <div className={this.get_style()}>
                {header}
                <h4>{subject + this.get_tags()}</h4>
                <div className="span_text_area" onMouseUpCapture={this.props.of_center_email ?
                    (e) => this.setState({ add_task_icon: this.handle_mouse_up(e) }) :
                    null}>
                    {content}
                </div>
                {this.state.add_task_icon}
                {this.state.add_task_component}
            </div>
        );
    }
}