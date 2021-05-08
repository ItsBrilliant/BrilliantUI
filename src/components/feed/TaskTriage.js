import React from 'react';
import { useTasks } from '../../hooks/redux';
import TaskPost from './TaskPost';

export function OverdueTasks(props) {
    let tasks = useTasks(
        ['priority', 'approve_status', 'deadline'],
        [0, 'approved', new Date()],
        [undefined, undefined, (a, b) => a < b]
    );
    if (tasks.length === 0) {
        return null;
    }

    return <TaskPost tasks={tasks} />;
}
