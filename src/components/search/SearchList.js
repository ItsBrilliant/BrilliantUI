import React, { useState } from "react";
import ReactDOM from "react-dom";
import { SearchConversations, SearchEvents, SearchTasks } from "./SearchResult";

export function SearchList(props) {
  const list = (
    <div className="SearchList">
      <SearchConversations search_value={props.search_value} />
      <SearchEvents search_value={props.search_value} />
      <SearchTasks search_value={props.search_value} />
    </div>
  );
  return list;
  // ReactDOM.createPortal(list, document.getElementById("messages_to_user"));
}
