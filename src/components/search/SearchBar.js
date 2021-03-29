import { SearchBarStyle } from "./Search.style";
import React from "react";

export const SearchBar = ({ ...props }) => {
  return (
    <SearchBarStyle>
      <img src="button_icons/search.png"></img>
      <input
        key="search_bar"
        value={props.keyword}
        placeholder={"search"}
        onChange={(e) => props.setKeyword(e.target.value)}
        onFocus={props.my_on_focus}
        onBlur={props.my_on_blur}
      />
    </SearchBarStyle>
  );
};
