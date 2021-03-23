import React from "react";
import FeedElement from "./FeedElement";
import FeedComponent from "./FeedComponent";
import { BrilliantFeedStyled, FeedWrapper } from "./Feed.style";
import SimpleBar from "simplebar-react";
import {
  NextMeeting,
  UrgentEmails,
  OverdueTasks,
  UnfinishedDrafts,
} from "./FeedExamples";

export default function BrilliantFeed() {
  const feed_elements = [
    <OverdueTasks time="9:00" />,
    <UrgentEmails />,
    <NextMeeting />,
    <UnfinishedDrafts time="10:30" />,
  ];
  return (
    <FeedWrapper>
      <SimpleBar className="simple_bar">
        <BrilliantFeedStyled> {feed_elements} </BrilliantFeedStyled>
      </SimpleBar>
    </FeedWrapper>
  );
}
