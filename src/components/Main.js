import { LeftDivision } from './LeftDivision.js';
import { CenterDivision } from './CenterDivision.js';
import { RightDivision } from './RightDivision.js';
import './Main.css';
import React, { Component } from 'react';
import { Thread, create_threads } from '../data_objects/Thread.js';
import { get_mailbox } from '../data_objects/Connect.js';
import { Contact } from '../data_objects/Contact.js';

export const person0 = Contact.create_contact({
    'emailAddress': {
        'address': 'dovbridger@hotmail.com',
        'name': 'Dov Bridger'
    }
})

export class Main extends Component {
    constructor(props) {
        super(props);
        console.log("Started Main");
        this.handleSelect = this.handleSelect.bind(this);
        this.emailThreads = undefined
        this.state = {
            selected_thread_id: undefined
        };
    }

    handleSelect(id) {
        this.setState({ selected_thread_id: id });
    }

    componentDidMount() {
        get_mailbox((emails) => this.set_threads(emails))
    }

    set_threads(emails) {
        this.emailThreads = create_threads(emails)
        this.setState({ selected_thread_id: Object.keys(this.emailThreads)[0] });
    }

    render() {
        if (this.state.selected_thread_id === undefined) {
            return null;
        }
        const selected_thread = this.emailThreads[this.state.selected_thread_id]
        return (
            <div className='Main'>
                <LeftDivision
                    emailThreads={this.emailThreads}
                    handle_select={this.handleSelect}
                    selected_thread_id={this.state.selected_thread_id} />
                <div><CenterDivision thread={selected_thread} /></div>
                <div>{RightDivision(selected_thread)}</div>
            </div>
        )
    }
}