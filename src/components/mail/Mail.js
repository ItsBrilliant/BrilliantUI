import { LeftDivision } from './LeftDivision.js';
import CenterDivision from './CenterDivision.js';
import { RightDivision } from './RightDivision.js';
import './Mail.css';
import React, { Component } from 'react';
import { UnorderedCollection } from 'http-errors';

export class Mail extends Component {
    constructor(props) {
        super(props);
        console.log("Started Mail");
        this.state = {
            selected_thread_id: undefined,
            selected_task_index: -1,
            selected_folder: "Inbox"
        }
        this.handleSelect = this.handleSelect.bind(this);
        this.handle_task_hover = this.handle_task_hover.bind(this);
        this.set_selected_folder = this.set_selected_folder.bind(this);

    }
    set_selected_folder(name) {
        this.setState({ selected_folder: name });
        this.handleSelect(undefined)
    }
    handleSelect(id) {
        this.setState({ selected_thread_id: id });
    }

    handle_task_hover(task) {
        this.setState({ selected_task: task });
    }

    render() {
        const selected_thread = this.props.emailThreads[this.state.selected_thread_id]
        return (
            <div className='Mail'>
                <LeftDivision
                    emailThreads={this.props.emailThreads}
                    handle_select={this.handleSelect}
                    selected_thread_id={this.state.selected_thread_id}
                    load_threads_function={this.props.load_threads_function}
                    user={this.props.user}
                    folders={this.props.folders}
                    set_selected_folder={this.set_selected_folder}
                    selected_folder={this.state.selected_folder}
                />
                <CenterDivision thread={selected_thread}
                    selected_folder={this.state.selected_folder}
                    selected_task={this.state.selected_task} />
                <RightDivision thread={selected_thread} />
            </div>
        )
    }
}