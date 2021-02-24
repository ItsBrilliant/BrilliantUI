import React, { Component } from 'react'
import { Menu } from '../external/Menues.js';
import { AddTaskPortal } from '../AddTaskPortal.js';
import { Task } from '../../data_objects/Task.js';
import { URGENT } from '../../data_objects/Consts.js';
import { getSelectionOffsetRelativeTo, get_priority_style } from '../../utils.js';
import { GroupIcon } from './EmailStamp.js';
import "./EmailTextArea.css";
import OptionsButton from '../OptionsButton.js';
import { connect } from 'react-redux'
import { Update } from '../../actions/tasks'

class EmailTextArea extends Component {
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
        if (this.props.external_on_task_portal_close) {
            this.props.external_on_task_portal_close();
        }
    }
    handle_add_task(text, date, priority, owner) {
        this.handle_task_component_close();
        const task_args = this.state.task_args;
        const task_format_indexes = {
            start: task_args.selection_indexes[0],
            end: task_args.selection_indexes[1]
        }
        var task;
        if (task_args.id) {
            task = this.props.tasks.filter(t => t.id === task_args.id)[0]
            task.text = text;
            task.deadline = date;
            task.priority = priority;
            task.owner = owner;
        } else {
            task = new Task(text, date, priority, false, task_format_indexes, owner);
        }
        task.set_approved(true);
        Task.insert_task(this.props.Update, this.props.email, task)

    }
    componentWillReceiveProps(next_props) {
        if (next_props.external_show_task_portal && !this.props.external_show_task_portal) {
            const [x, y] = next_props.task_portal_location;
            this.setState(
                {
                    add_task_icon: null,
                    add_task_component: <AddTaskPortal style={get_mouse_position_style(x, y)}
                        handle_ok={this.handle_add_task}
                        handle_close={this.handle_task_component_close}
                        priority={URGENT}
                        task_text=""
                    />,
                    task_args: {
                        selection_indexes: [-1, -1],
                        id: undefined
                    }
                }
            );
        }
    }
    handle_task_icon_click(position_style, selection_indexes, existing_task) {
        let priority = URGENT;
        let text = "";
        let id;
        if (existing_task) {
            priority = existing_task.priority;
            text = existing_task.text;
            id = existing_task.id;
        }
        this.setState(
            {
                add_task_icon: null,
                add_task_component: <AddTaskPortal style={position_style}
                    handle_ok={this.handle_add_task}
                    handle_close={this.handle_task_component_close}
                    priority={priority}
                    task_text={text}
                />,
                task_args: {
                    selection_indexes: selection_indexes,
                    id: id
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
                const position_style = get_mouse_position_style(e.pageX, e.pageY);
                return this.get_add_task_icon(position_style, [startOffset, endOffset])
            }
        }
        return null;
    }

    get_add_task_icon(position_style, selection_indexes, existing_task) {
        return (
            <img className="manual_add_task" src='button_icons/task.svg'
                style={position_style}
                onClick={() => this.handle_task_icon_click(position_style, selection_indexes, existing_task)}>
            </img>
        );
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

    // Insert task highligts
    render_content(text) {
        let tasks = this.props.tasks.filter(t => t.source_indexes.start >= 0);
        if (!this.props.of_center_email || tasks.length === 0) {
            return <span>{text}</span>
        }
        var sections = []
        tasks = tasks.sort(function (a, b) { return a.get_source_indexes().start - b.get_source_indexes().start; });
        const first_highlight = tasks[0].get_source_indexes()
        if (first_highlight && first_highlight.start > 0) {
            sections.push(<span>{text.slice(0, first_highlight.start)}</span>)
        }
        for (let i = 0; i < tasks.length; i++) {
            const start = tasks[i].get_source_indexes().start
            const end = tasks[i].get_source_indexes().end
            var style = 'task_source';
            if (!tasks[i].isDone) {
                if (tasks[i].is_approved()) {
                    style += ' ' + get_priority_style(tasks[i].get_priority())
                } else {
                    style += ' ' + "before_approval";
                }
            }
            sections.push(
                <span className={style} onMouseEnter={on_proposed_task_hover.bind(this, tasks[i])} >
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
        const subject = this.props.subject ? this.props.subject : "(no subject)";
        const content = this.props.is_html ? this.props.content : this.render_content(this.props.content);
        const priority_style = get_priority_style(this.props.priority);
        const options = ['Mark as unread', 'Delete'].map(o => { return { name: o } });
        options.filter(o => o.name === 'Delete')[0].action = this.props.on_delete;
        options.filter(o => o.name === 'Mark as unread')[0].action = this.props.on_mark_unread;
        const header = this.props.of_center_email ?
            <div className="header">
                <h4>{this.props.sender_name}</h4>
                <div className="GroupIconWrapper">
                    {GroupIcon(this.props.contacts, 6, 40, 30)}
                    <div className={"email_priority " + priority_style} />
                    <OptionsButton options={options} offset={{ left: -150, top: 0 }}></OptionsButton>
                </div>
            </div> : null;

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

function get_mouse_position_style(x, y) {
    const top_offset = y ? y - 60 : "40vh";
    const left_offset = x ? x - 20 : "40vw";
    return {
        position: 'fixed',
        top: top_offset,
        left: left_offset,
    };
}

function on_proposed_task_hover(task, e) {
    if (task.is_approved() || this.state.add_task_icon) {
        return;
    }
    const position_style = get_mouse_position_style(e.pageX, e.pageY);
    const source_indexes = task.get_source_indexes();
    const selection_indexes = [source_indexes.start, source_indexes.end];
    this.setState({ add_task_icon: this.get_add_task_icon(position_style, selection_indexes, task) });
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {
    Update
};

export default connect(mapStateToProps, mapDispatchToProps)(EmailTextArea);