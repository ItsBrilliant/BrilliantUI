import { LeftDivision } from './LeftDivision.js';
import CenterDivision from './CenterDivision.js';
import { RightDivision } from './RightDivision.js';
import './Mail.css';
import React, { Component } from 'react';
import { UnorderedCollection } from 'http-errors';
import { Thread } from '../../data_objects/Thread.js';

export class Mail extends Component {
    constructor(props) {
        super(props);
        console.log("Started Mail");
        this.state = {
            selected_thread_id: undefined,
            selected_folder: "Inbox"
        }
        Thread.SELECTED_FOLDER_ID = this.props.folders["Inbox"];
        this.handleSelect = this.handleSelect.bind(this);
        this.set_selected_folder = this.set_selected_folder.bind(this);

    }
    set_selected_folder(name) {
        this.setState({ selected_folder: name });
        Thread.SELECTED_FOLDER_ID = this.props.folders[name];
        this.handleSelect(undefined)
    }
    handleSelect(id) {
        this.setState({ selected_thread_id: id });
    }

    render() {
        const selected_thread = this.props.emailThreads[this.state.selected_thread_id];
        const selected_folder_id = this.props.folders[this.state.selected_folder];
        const selected_thread_emails = selected_thread ? selected_thread.get_emails(null) : [];
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
                    selected_folder_id={selected_folder_id}
                    selected_folder={this.state.selected_folder}
                    folders={this.props.folders}
                    emails={selected_thread_emails} />
                <RightDivision thread={selected_thread} selected_folder_id={selected_folder_id} />
            </div>
        )
    }
}