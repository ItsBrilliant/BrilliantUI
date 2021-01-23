import React from 'react'
import ReactDOM from 'react-dom'
import { DEFAULT_HIGHLIGHTS } from '../../data_objects/Consts.js'
import SimpleBar from 'simplebar-react'
import './SingleTaskInfo.css'
import { AttachmentDisplay } from './FileAttachments.js'
import { EmailThread } from './EmailThread.js'
import { GroupIcon } from './EmailStamp.js'

export default function SingleTaskInfo(props) {
    const task_info =
        <div className="SingleTaskInfo">
            <SimpleBar className="simplebar">
                <TopButtons />
                <h4>{props.task.get_text()}</h4>
                <QuickReply to={props.sender} />
                <People watching={props.thread.get_participants()}
                    owner={props.task.get_owner()} />
                <Highlights highlights={DEFAULT_HIGHLIGHTS} />
                <RelevantResources resources={props.thread.get_attachments()} />
                <SourceConversation thread={props.thread} />
            </SimpleBar>
        </div>
    return ReactDOM.createPortal(
        task_info,
        document.getElementById('messages_to_user')
    );
}

function TopButtons(props) {
    return (
        <div>
            TopButtons
        </div>
    )
}

function QuickReply(props) {
    return (
        <div>
            QuickReply
        </div>
    )
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
    return <TitledComponent title="People" component={people_componenet} />
}

function Highlights(props) {
    const highlights =
        <ul> {props.highlights.map(h => <li>{h}</li>)}</ul>

    return <TitledComponent title="Highlights" component={highlights} />
}

function RelevantResources(props) {
    const attachemnts_for_display = props.resources.map(a => <AttachmentDisplay attachment={a} />);
    return <TitledComponent title="Relevant Resources" component={attachemnts_for_display} />
}

function SourceConversation(props) {
    const email_thread_component = <EmailThread id={props.thread.get_id()} thread={props.thread} is_selected={false}
        handle_select={() => { }} priority={null} />
    return <TitledComponent title="Source Conversation" component={email_thread_component} />
}

function TitledComponent(props) {
    return (
        <div className="TitledComponent">
            <h4 className="title">{props.title}</h4>
            <div className="general_component">
                {props.component}
            </div>
        </div>
    );
}

