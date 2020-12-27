import React, { Component } from 'react';
import './Modal.css';
import MyModal from './Modal.js'
import { Fragment } from 'react';
import { create_mail_object } from '../../utils';
import { send_email } from '../../backend/Connect.js'


export class EmailReplyModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email_address: "",
            email_subject: "",
            email_text: "",
        };
        this.handle_input_change = this.handle_input_change.bind(this);
        this.send_mail = this.send_mail.bind(this);
    }
    handle_input_change(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    send_mail() {
        const email = create_mail_object([this.state.email_address], this.state.email_subject, this.state.email_text);
        send_email(email);
        this.props.handle_ok();
    }
    render() {
        const modal_body_props = {
            email_address: this.state.email_address,
            email_subject: this.state.email_subject,
            email_text: this.state.email_text,
            handle_input_change: this.handle_input_change
        }
        return (
            <div className='MyModal'>
                <MyModal title="Send Email"
                    show={this.props.show}
                    onOk={this.send_mail}
                    closeModal={this.props.close}
                    modalBody={EmailReplyModalBody(modal_body_props)} />
            </div>

        );
    }
}

function EmailReplyModalBody(props) {
    return (
        <Fragment>
            <label for="email_address"> To: </label>
            <input name='email_address' className="text_input" value={props.email_address} onChange={props.handle_input_change} />
            <label for="email_subject"> Subject: </label>
            <input name='email_subject' className="text_input" value={props.email_subject} onChange={props.handle_input_change} />
            <label for="email_text"> Message: </label>
            <input name="email_text" className="text_input" value={props.email_text} onChange={props.handle_input_change} />
        </Fragment>
    );
}