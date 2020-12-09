import { Component } from 'react';
import './Modal.css';
import { CAN_WAIT, Task, URGENT } from "../data_objects/EmailObjects.js";
import MyModal from './Modal.js'
import { Fragment } from 'react';

export class AddTaskModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            task_text: "",
            task_deadline: new Date(),
            task_priority: CAN_WAIT
        };
        this.handle_ok = this.handle_ok.bind(this);
        this.handle_input_change = this.handle_input_change.bind(this);
    }
    handle_ok() {
        let task = new Task(this.state.task_text, this.state.task_deadline, this.state.task_priority, false);
        this.props.handle_ok(task);
    }
    handle_input_change(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    render() {
        const modal_body_props = {
            task_text: this.state.task_text,
            task_deadline: this.state.task_deadline,
            task_priority: this.state.task_priority,
            handle_input_change: this.handle_input_change
        }
        return (
            <div className='MyModal'>
                <MyModal title="Add Task"
                    show={this.props.show}
                    onOk={this.handle_ok}
                    closeModal={this.props.close}
                    ModalBody={AddTaskModalBody(modal_body_props)} />
            </div>

        );
    }
}

function AddTaskModalBody(props) {
    return (
        <Fragment>
            <label for="task_text"> Task Content: </label>
            <input name='task_text' className="text_input" value={props.task_text} onChange={props.handle_input_change}></input>
            <label for="task_deadline"> Deadline: </label>
            <input name='task_deadline' type='date' value={props.task_deadline} onChange={props.handle_input_change}></input>
            <label for="task_priority"> Priority: </label>
            <select name="task_priority" id="priority" value={props.task_priority} onChange={props.handle_input_change}>
                <option value="0">Urgent</option>
                <option value="1">Important</option>
                <option value="2">Can Wait</option>
            </select>
        </Fragment>
    );
}