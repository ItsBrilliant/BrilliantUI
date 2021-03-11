import React, { Component } from 'react'
import './EmailThread.css'
import OptionsButton from '../OptionsButton.js'
import EmailTextArea from './EmailTextArea.js'
import { EmailStamp } from './EmailStamp.js'
import { useSelector, useDispatch } from 'react-redux'
import { DeleteEmails } from '../../actions/email_threads'
import { Create } from '../../actions/email_composer.js';
import { build_email_action_button } from '../email_compuser_utils'

export default class EmailThread extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show_task_portal: false,
            location: [null, null]
        }
    }
    get_selected_email() {
        return this.props.thread.get_emails()[0];
    }

    get_style() {
        var style = 'EmailThread';
        if (this.props.is_selected) {
            style = style + ' selected_thread';
        }

        if (this.has_unread()) {
            style = style + ' unread';
        }
        return style
        //return this.props.is_selected ? 'EmailThread selected_thread' : 'EmailThread';
    }

    get_receiver_icons() {
        var receiver_icons = []
        for (const receiver of this.get_selected_email().receivers) {
            receiver_icons.push(receiver.image_link)
        }
        return receiver_icons;
    }
    get_has_attachments() {
        for (const email of this.props.thread.get_emails()) {
            if (email.get_attachments_names().length > 0) {
                return true;
            }
        }
        return false;
    }

    has_unread() {
        for (const email of this.props.thread.get_emails()) {
            if (!email.get_is_read()) {
                return true;
            }
        }
        return false;
    }

    get_num_unread() {
        var count = 0
        for (const email of this.props.thread.emails) {
            if (!email.get_is_read()) {
                count++;
            }
        }
        return count;
    }
    render() {
        //const num_unread_emails = this.get_num_unread()
        //        const receiver_icons = this.get_receiver_icons();
        const selected_email = this.get_selected_email();
        if (!selected_email) {
            return null;
        }
        const has_attatchments = this.get_has_attachments();
        const sender = selected_email.get_sender();
        const stamp = sender ? EmailStamp([sender.get_icon()], selected_email.date, sender.get_name()) : null;
        return (
            <div className={this.get_style()} onClick={() => this.props.handle_select(this.props.id)}>
                {stamp}
                <EmailTextArea isUnread={this.has_unread()}
                    content={selected_email.get_text()}
                    subject={selected_email.get_subject()}
                    tags={selected_email.get_tags()}
                    external_show_task_portal={this.state.show_task_portal}
                    task_portal_location={this.state.location}
                    external_on_task_portal_close={() => this.setState({ show_task_portal: false })}
                    email={selected_email}
                    tasks={[]} />
                <ThreadLabels
                    has_attachments={has_attatchments}
                    priority={this.props.priority}
                    thread_id={this.props.id}
                    options_offset={this.props.options_offset}
                    show_task_portal={(e) => this.setState({
                        show_task_portal: true,
                        location: [e.pageX, e.pageY]
                    })}
                />
            </div>
        )
    }
}

function ThreadLabels(props) {
    const dispatch = useDispatch()
    const thread = useSelector(state => state.email_threads[props.thread_id]);
    const tasks = useSelector(state => Object.values(state.tasks));
    const num_tasks = tasks.filter(t => (!t.is_done() && t.approved) && (t.thread_id === props.thread_id)).length;
    const option_names = ["Set as task", "Change priority", "Mark as read", "Delete"];
    let options = option_names.map(n => { return { name: n } });
    options.filter(o => o.name === 'Delete')[0].action = () => {
        thread.delete_all((t_id, e_ids) => dispatch(DeleteEmails(t_id, e_ids)));
    }
    options.filter(o => o.name === 'Set as task')[0].action = props.show_task_portal;
    const email_id = thread.get_emails()[0].get_id();

    options.filter(o => o.name === 'Mark as read')[0].action = () => thread.mark_all_read();
    options.filter(o => o.name === "Change priority")[0].action = () => thread.set_priority((thread.get_priority() + 1) % 3);
    options.splice(2, 0, ...['reply', 'reply_all', 'forward'].map(type => build_email_action_button(dispatch, type, email_id)));
    return (
        <div className='thread_labels'>
            <div className={'num_tasks_label ' + props.priority}>
                {num_tasks}
                {props.has_attachments ? attachmentIcon() : null}
            </div>
            <OptionsButton options={options} offset={props.options_offset}></OptionsButton>
        </div>
    )
}

export function attachmentIcon() {
    return <img className='attachment' src='file_icons/attachment.png' />
}
