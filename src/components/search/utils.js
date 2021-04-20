export function render_search_text(text, search_value) {
    let start_index = -1;
    try {
        start_index = text.toLowerCase().search(search_value.toLowerCase());
    } catch (e) {
        console.log(`Error searching for ${search_value} in ${text}: ${e}`);
    }

    if (start_index === -1) {
        return <p>{text}</p>;
    } else {
        const end_index = start_index + search_value.length;
        return (
            <p>
                <span>{text.slice(0, start_index)}</span>
                <span className="matched_search_text">
                    {text.slice(start_index, end_index)}
                </span>
                <span>{text.slice(end_index)}</span>
            </p>
        );
    }
}

export function reduce_results(arr, current_num, limit) {
    if (current_num <= limit) {
        return arr;
    }
    const required_arr_num = Math.round((arr.length * limit) / current_num);
    return arr.slice(0, required_arr_num);
}

export function get_filtered_search_results(
    type,
    filter,
    get_search_results,
    ...args
) {
    if (filter.length === 0 || filter.includes(type)) {
        return get_search_results(...args);
    } else {
        return [];
    }
}

export function selectify(options) {
    return options.map((o) => ({ label: o, value: o }));
}
