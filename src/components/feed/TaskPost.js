import React from 'react';
import { useTasks } from '../../hooks/redux';
import FeedComponent from './FeedComponent';

export default function TaskPost(props) {
    const tasks_for_approval = useTasks('approve_status', undefined);
}

function SingleTask(props) {
    const initiator = props.task.initiator;
}
