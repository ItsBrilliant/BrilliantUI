import { LeftDivision } from './LeftDivision.js';
import { CenterDivision } from './CenterDivision.js';
import { RightDivision } from './RightDivision.js';
import './Main.css';
import React, { Component } from 'react';
import { Contact } from '../data_objects/Contact.js';

export const person0 = Contact.create_contact({
    'emailAddress': {
        'address': 'dovbridger@itsbrilliant.com',
        'name': 'Dov Bridger'
    }
})

export class Main extends Component {
    constructor(props) {
        super(props);
        console.log("Started Main");
        this.state = {
            selected_thread_id: undefined
        }
        this.handleSelect = this.handleSelect.bind(this);
    }

    handleSelect(id) {
        this.setState({ selected_thread_id: id });
    }


    render() {
        // if (this.state.selected_thread_id === undefined) {
        //            return null;
        //       }
        const selected_thread = this.props.emailThreads[this.state.selected_thread_id]
        return (
            <div className='Main'>
                <LeftDivision
                    emailThreads={this.props.emailThreads}
                    handle_select={this.handleSelect}
                    selected_thread_id={this.state.selected_thread_id}
                    load_threads_function={this.props.load_threads_function} />
                <CenterDivision thread={selected_thread} />
                {RightDivision(selected_thread)}
            </div>
        )
    }
}