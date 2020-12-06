import { LeftDivision } from './LeftDivision.js';
import { CenterDivision } from './CenterDivision.js';
import { RightDivision } from './RightDivision.js';
import './Main.css';
import { emailThreads } from './RawData.js';
import { Component } from 'react';
import axios from 'axios';

export class Main extends Component {
    constructor(props) {
        super(props);
        console.log("Started Main");
        this.state = {
            selected_thread_index: emailThreads.selected_index
        };
        this.handleSelect = this.handleSelect.bind(this);
    }

    handleSelect(id) {
        this.setState({ selected_thread_index: id });
    }
    render() {
        const selected_thread = emailThreads.threads[this.state.selected_thread_index];
        return (
            <div className='Main'>
                <LeftDivision
                    emailThreads={emailThreads}
                    handle_select={this.handleSelect}
                    selected_thread_index={this.state.selected_thread_index} />
                <div><CenterDivision thread={selected_thread} /></div>
                <div>{RightDivision(selected_thread)}</div>
            </div>
        )
    }
}