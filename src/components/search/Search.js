import React, { useState } from "react";
import { isCompositeComponent } from "react-dom/test-utils";
import { SearchBar } from "./SearchBar";
import { SearchList } from "./SearchList";
import { SearchStyle } from "./Search.style";

export function Search(props) {
  const [search_value, set_search] = useState("");
  const [list_visible, set_visible] = useState(false);
  return (
    <SearchStyle list_open={list_visible}>
      <SearchBar
        keyword={search_value}
        my_on_blur={() => setTimeout(() => set_visible(false), 100)}
        my_on_focus={() => set_visible(true)}
        setKeyword={set_search}
      ></SearchBar>
      <SearchList visible={list_visible} search_value={search_value} />
    </SearchStyle>
  );
}
