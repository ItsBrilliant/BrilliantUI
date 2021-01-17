import React from "react";
import { Contact } from '../../data_objects/Contact.js'
import "./EmailChips.css";

export class EmailChips extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            error: null,
            options: []
        };
        this.email_chip_input_id = `email_chip_input_${props.composer_id}_${props.recipient_id}`
    }
    handleKeyDown = evt => {
        if (["Enter", "Tab", ","].includes(evt.key)) {
            evt.preventDefault();
            var value = this.state.value.trim();

            if (value) {
                if (this.isValid(value)) {
                    this.setState({
                        value: "",
                        options: []
                    });
                    this.props.on_items_change([...this.props.items, value]);
                } else {
                    const old_options = this.state.options;
                    if (old_options.length > 0) {
                        this.setState({
                            error: null,
                            options: old_options.slice(0, 1),
                            value: old_options[0]
                        })
                    } else {
                        this.setState({
                            value: value,
                            options: []
                        });
                    }
                }
            }
        }
    };

    handle_option_select(value) {
        this.handleChange(value)
        const chips_input_element = document.getElementById(this.email_chip_input_id);
        chips_input_element.focus();
    }

    handleChange(value) {
        const options = Contact.get_filtered_contacts(value);
        this.setState({
            value: value,
            error: null,
            options: options
        });
        //     eventFire(document.getElementById('select_list'), 'click');
    };

    handleDelete = item => {
        this.props.on_items_change(this.props.items.filter(i => i !== item));
    };

    handlePaste = evt => {
        evt.preventDefault();

        var paste = evt.clipboardData.getData("text");
        var emails = paste.match(/[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/g);

        if (emails) {
            var toBeAdded = emails.filter(email => !this.isInList(email));

            this.props.on_items_change([...this.props.items, ...toBeAdded]);
        }
    };

    isValid(email) {
        let error = null;

        if (this.isInList(email)) {
            error = `${email} has already been added.`;
        }

        if (!this.isEmail(email)) {
            error = `${email} is not a valid email address.`;
        }

        if (error) {
            this.setState({ error });

            return false;
        }

        return true;
    }

    isInList(email) {
        return this.props.items.includes(email);
    }

    isEmail(email) {
        return /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(email);
    }

    render() {
        return (
            <div id="chips_container">
                {this.props.items.map(item => (
                    <div className="tag-item" key={item}>
                        {Contact.get_contact_name_by_address(item) || item}
                        <button
                            type="button"
                            className="button"
                            onClick={() => this.handleDelete(item)}
                        >
                            &times;
            </button>
                    </div>
                ))}

                <input id={this.email_chip_input_id} autoComplete="off"
                    className={"input " + (this.state.error && " has-error")}
                    value={this.state.value}
                    placeholder=""
                    onKeyDown={this.handleKeyDown}
                    onChange={(e) => this.handleChange(e.target.value)}
                    onPaste={this.handlePaste}
                />
                <ul>
                    {this.state.options.map(o => <li onClick={(e) => this.handle_option_select(e.target.innerText)}
                        value={o}>{o}</li>)}
                </ul>

            </div>
        );
    }
}


function eventFire(el, etype) {
    if (el.fireEvent) {
        el.fireEvent('on' + etype);
    } else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
    }
}
//                {this.state.error && <p className="error">{this.state.error}</p>}