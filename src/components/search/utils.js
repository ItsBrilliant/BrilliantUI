export function render_search_text(text, search_value) {
  const start_index = text.toLowerCase().search(search_value.toLowerCase());
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
