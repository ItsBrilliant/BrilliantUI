import React from "react";
import FeedElement from "./FeedElement";
import { BrilliantFeedStyled } from "./Feed.style";
import SimpleBar from "simplebar-react";

export default function BrilliantFeed() {
  const title = "Title of element";
  const time = "12:30";
  let lines = [];
  for (let i = 0; i < 5; i++) {
    lines.push(i + ".............................");
  }
  const component = (
    <div>
      {" "}
      {lines.map((l) => (
        <h1> {l} </h1>
      ))}
    </div>
  );
  const feed_element = (
    <FeedElement title={title} time={time} component={component} />
  );
  const feed_elemnts = [feed_element, feed_element, feed_element];
  return (
    <SimpleBar className="simple_bar">
      <BrilliantFeedStyled> {feed_elemnts} </BrilliantFeedStyled>
    </SimpleBar>
  );
}
