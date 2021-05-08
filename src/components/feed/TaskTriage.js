import React from 'react';
import { useSelector } from 'react-redux';
import { useTasks } from '../../hooks/redux';
import TaskPost from './TaskPost';
import { get_days_diff } from './utils';
import { Contact } from '../../data_objects/Contact';

const HANGING_TASK_DAYS = 7;

export function HangingTasks(props) {
    let tasks = useTasks(
        ['owner', 'priority', 'status', 'approve_status', 'creation_time'],
        [Contact.CURRENT_USER, 0, 'To do', 'approved', new Date()],
        [
            undefined,
            undefined,
            undefined,
            undefined,
            (a, b) => get_days_diff(b, a) >= HANGING_TASK_DAYS,
        ]
    );
    if (tasks.length === 0) {
        return null;
    }

    return <TaskPost tasks={tasks} />;
}

export function OverdueTasks(props) {
    let tasks = useTasks(
        ['owner', 'approve_status', 'deadline'],
        [Contact.CURRENT_USER, 'approved', new Date()],
        [
            undefined,
            undefined,
            (a, b) => get_days_diff(a, b) <= props.days_from_deadline,
        ]
    );
    if (props.priority !== undefined) {
        tasks = tasks.filter((t) => t.priority === props.priority);
    }
    if (tasks.length === 0) {
        return null;
    }

    return <TaskPost tasks={tasks} />;
}
