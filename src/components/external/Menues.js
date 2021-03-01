import React, { Component } from 'react';
import './Menues.css';
import Dropdown from 'react-dropdown';
import { PRIORITY_KEY, TIME_KEY } from '../../data_objects/Consts.js';


export default class Menues extends Component {
    render() {
        return (
            <div className='Menues'>
                <Menu options={['Incoming', 'Outgoing']} label='' value={this.props.incoming_value} onChange={this.props.handle_incoming} />
                <Menu options={[PRIORITY_KEY, TIME_KEY]} label='Group: ' value={this.props.group_value} onChange={this.props.handle_grouping} />
                <Menu options={[PRIORITY_KEY, TIME_KEY]} label='Sort: ' value={this.props.sort_value} onChange={this.props.handle_sorting} />
            </div>
        )
    }
}

export function Menu(props) {

    return (
        <div className='Menu'>
            <span>{props.label}</span>
            <div className={props.style_class}>
                <Dropdown className={props.style_class}
                    options={props.options}
                    value={props.value}
                    onChange={props.onChange}
                    placeholder='...'
                />
            </div>
        </div>
    )
}


