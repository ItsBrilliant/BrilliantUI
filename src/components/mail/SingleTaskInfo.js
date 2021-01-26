import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { DEFAULT_HIGHLIGHTS } from '../../data_objects/Consts.js'
import SimpleBar from 'simplebar-react'
import './SingleTaskInfo.css'
import { AttachmentDisplay } from './FileAttachments.js'
import { EmailThread } from './EmailThread.js'
import { GroupIcon } from './EmailStamp.js'
import { Menu } from '../external/Menues.js'
import OptionsButton from '../OptionsButton.js'
import PriorityOptions from '../PriorityOptions.js'
import { EmailComposer } from '../EmailComposer.js'

function SingleTaskInfo(props) {
    return (
        <div className="SingleTaskInfo">
            <div className="header">
                <TopButtons task={props.task} />
                <h1 className="task_text">{props.task.get_text()}</h1>
            </div>
            <div className="scrollable">
                <SimpleBar className="simplebar">
                    <QuickReply to={props.sender} />
                    <People watching={props.thread.get_participants()}
                        owner={props.task.get_owner()} />
                    <Highlights highlights={DEFAULT_HIGHLIGHTS} />
                    <RelevantResources resources={props.thread.get_attachments()} />
                    <SourceConversation thread={props.thread} />
                </SimpleBar>
            </div>
        </div>
    );
}

export default function TaskInfoWrapper(props) {
    if (!props.visible) {
        return null;
    }
    return ReactDOM.createPortal(
        <div className="TaskInfoWrapper">
            <div className="invisible_close" onClick={props.close} />
            <SingleTaskInfo {...props} />
        </div>,
        document.getElementById('messages_to_user')
    );
}

function TopButtons(props) {
    const [priority, setPriority] = useState(props.task.get_priority())
    const [task_status, setStatus] = useState(props.task.isDone ? "Done" : "To do")
    const option_button_names = ["Quick Reply", "Set In Calendar", "Add To Topic", "Go To Source", "Mark As Done"];
    var options_buttons = option_button_names.map(n => { return { name: n } });
    options_buttons.filter(n => n.name === "Mark As Done")[0].action = e => setStatus("Done");
    const task_options = ['To do', 'In progress', 'Pending', 'Done'];
    return (
        <div className="TopButtons">
            <div className="task_status">
                <Menu options={task_options} label='' value={task_status} onChange={
                    e => setStatus(e.value)} />
            </div>
            <OptionsButton options={options_buttons} />
            <div className="task_priority">
                <PriorityOptions default_selection={priority} onChange={setPriority} />
            </div>
            <span>{props.task.get_formatted_deadline().date}</span>
        </div>
    )
}

function QuickReply(props) {
    const quick_reply_component =
        <EmailComposer only_content={true}
            on_close={undefined}
            id={-1}
            send={undefined}
            email_attributes={undefined}
        />
    return <TitledComponent title="Quick Reply" component={quick_reply_component} class_name={"quick_reply"} />
}

function People(props) {
    const watching =
        <span>
            <div><p> Watching</p></div>
            {GroupIcon(props.watching, 6, 30, 22)}
        </span>

    const owner =
        <span>
            {GroupIcon([props.owner], 1, 50)}
            <div>
                <p className="owner_name">{props.owner.get_name()}</p>
                <p>Owner</p>
            </div>
        </span>

    const people_componenet =
        <div className="People">
            {owner}
            {watching}
        </div>
    return <TitledComponent title="People" component={people_componenet} class_name="People" />
}

function Highlights(props) {
    const highlights =
        <ul> {props.highlights.map(h => <li>{h}</li>)}</ul>

    return <TitledComponent title="Highlights" component={highlights} />
}

function RelevantResources(props) {
    if (props.resources.length === 0) {
        return null;
    }
    const attachemnts_for_display =
        <div className="RelevantResources">
            {props.resources.map(a => <AttachmentDisplay attachment={a} />)}
        </div>

    return <TitledComponent title="Relevant Resources" component={attachemnts_for_display} />
}

function SourceConversation(props) {
    const email_thread_component = <EmailThread id={props.thread.get_id()} thread={props.thread} is_selected={false}
        handle_select={() => { }} priority={null} />
    return <TitledComponent title="Source Conversation" component={email_thread_component} />
}

function TitledComponent(props) {
    let general_class_name = "general_component";
    if (props.class_name) {
        general_class_name += " " + props.class_name;
    }
    return (
        <div className="TitledComponent">
            <h4 className="title">{props.title}</h4>
            <div className={general_class_name} >
                {props.component}
            </div>
        </div>
    );
}

