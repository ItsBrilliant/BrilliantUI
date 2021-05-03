import './task_highlights.css';
import { get_priority_style } from '../../utils.js';
export function render_task_highlights(text, tasks, on_hover = () => {}) {
    var sections = [];
    tasks = tasks.sort(function (a, b) {
        return a.source_indexes.start - b.source_indexes.start;
    });
    const first_highlight = tasks[0].source_indexes;
    if (first_highlight && first_highlight.start > 0) {
        sections.push(<span>{text.slice(0, first_highlight.start)}</span>);
    }
    for (let i = 0; i < tasks.length; i++) {
        const start = tasks[i].source_indexes.start;
        const end = tasks[i].source_indexes.end;
        var style = 'task_source';
        if (tasks[i].approved()) {
            style += ' ' + get_priority_style(tasks[i].get_priority());
        } else {
            style += ' before_approval';
        }
        sections.push(
            <span
                task_id={tasks[i].id}
                className={style}
                onMouseEnter={(e) => on_hover(tasks[i], e)}
            >
                {text.slice(start, end)}
            </span>
        );
        const next_start =
            i + 1 < tasks.length
                ? tasks[i + 1].source_indexes.start
                : text.length;
        if (next_start > end) {
            sections.push(<span>{text.slice(end, next_start)}</span>);
        }
    }
    return sections;
}
