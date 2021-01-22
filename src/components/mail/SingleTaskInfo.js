import React from 'react'
import ReactDOM from 'react-dom'
import { DEFAULT_HIGHLIGHTS } from '../../data_objects/Consts.js'
import SimpleBar from 'simplebar-react'
import './SingleTaskInfo.css'
import { useSelector } from 'react-redux'
import { EmailThread } from './EmailThread.js'

export default function SingleTaskInfo(props) {
    const task_info =
        <div className="SingleTaskInfo">
            <SimpleBar className="simplebar">
                <TopButtons />
                <h4>{props.task.get_text()}</h4>
                <QuickReply to={props.sender} />
                <People watching={props.participants}
                    initiator={props.sender}
                    owner={props.owner} />
                <Highlights highlights={DEFAULT_HIGHLIGHTS} />
                <RelevantResources resources={props.attachments} />
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
    return (
        <div>
            People
        </div>
    )
}

function Highlights(props) {
    return (
        <div>
            Highlights
        </div>
    )
}

function RelevantResources(props) {
    return (
        <div>
            RelevantResources
        </div>
    )
}

function SourceConversation(props) {
    const email_thread_component = <EmailThread id={props.thread.get_id()} thread={props.thread} is_selected={false}
        handle_select={() => { }} priority={null} />
    return <TitledComponent title="Source Conversation" component={email_thread_component} />
}

function SourceConversation1(props) {
    return (
        <div className="SourceConversation">
            <h4>Source Conversation</h4>
            <EmailThread id={props.thread.get_id()} thread={props.thread} is_selected={false}
                handle_select={() => { }} priority={null} />
        </div>
    )
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

