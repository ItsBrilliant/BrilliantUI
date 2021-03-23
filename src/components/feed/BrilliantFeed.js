import React from "react";
import FeedElement from "./FeedElement";
import FeedComponent from "./FeedComponent";
import { BrilliantFeedStyled, FeedWrapper } from "./Feed.style";
import SimpleBar from "simplebar-react";
import { UrgentEmails } from "./FeedExamples";

export default function BrilliantFeed() {
  const title = "Title of element";
  const time = "12:30";
  let lines = [];
  for (let i = 0; i < 3; i++) {
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
  const names = ["button1", "button2", "button3", "button4"];
  const buttons = names.map((n) => {
    return { name: n, action: () => alert(n) };
  });
  const feed_component = (
    <FeedComponent buttons={buttons} component={component} />
  );
  const feed_element = (
    <FeedElement title={title} time={time} component={feed_component} />
  );
  const feed_elements = [feed_element, <UrgentEmails />, feed_element];
  return (
    <FeedWrapper>
      <SimpleBar className="simple_bar">
        <BrilliantFeedStyled> {feed_elements} </BrilliantFeedStyled>
      </SimpleBar>
    </FeedWrapper>
  );
}
