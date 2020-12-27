import { LeftDivision } from './LeftDivision.js';
import { CenterDivision } from './CenterDivision.js';
import { RightDivision } from './RightDivision.js';
import './Mail.css';
import React, { Component } from 'react';
import { Contact } from '../../data_objects/Contact.js';

export const person0 = Contact.create_contact({
    'emailAddress': {
        'address': 'dovbridger@itsbrilliant.com',
        'name': 'Dov Bridger'
    }
})

export class Mail extends Component {
    constructor(props) {
        super(props);
        console.log("Started Main");
        this.state = {
            selected_thread_id: undefined,
            selected_task_index: -1
        }
        this.handleSelect = this.handleSelect.bind(this);
        this.handle_task_hover = this.handle_task_hover.bind(this);
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
                    load_threads_function={this.props.load_threads_function} />
                <CenterDivision thread={selected_thread} selected_task={this.state.selected_task} />
                {RightDivision(selected_thread, this.handle_task_hover)}
            </div>
        )
    }
}