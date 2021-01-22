import React from 'react'
import { DEFAULT_HIGHLIGHTS } from '../../data_objects/Consts.js'
import SimpleBar from 'simplebar-react'
import './SingleTaskInfo.css'
import { useSelector } from 'react-redux'

export default function SingleTaskInfo(props) {
    return (
        <div className="SingleTaskInfo">
            <SimpleBar>
                <TopButtons />
                <h4>{props.task.get_text()}</h4>
                <QuickReply to={props.sender} />
                <People watching={props.participants}
                    initiator={props.sender}
                    owner={props.owner} />
                <Highlights highlights={DEFAULT_HIGHLIGHTS} />
                <RelevantResources resources={props.attachments} />
                <SourceConversation thread_id={props.thread_id} />
            </SimpleBar>
        </div>
    )
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
    return (
        <div>
            SourceConversation
        </div>
    )
}

