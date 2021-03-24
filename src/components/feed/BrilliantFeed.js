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
import { IMPORTANT, URGENT } from "../../data_objects/Consts";
import { useSelector } from "react-redux";

export default function BrilliantFeed() {
  const user = useSelector((state) => state.user);
  const components = [
    { component: <OverdueTasks />, time: "09:00", title: "tasks" },
    {
      component: <UrgentEmails priority={IMPORTANT} />,
      time: "10:00",
      title: "important emails",
    },
    { component: <NextMeeting />, time: "11:00", title: "meeting" },
    { component: <UnfinishedDrafts />, time: "12:00", title: "drafts" },
    {
      component: <UrgentEmails priority={URGENT} />,
      time: "13:00",
      title: "Urgent emails",
    },
  ];
  const feed_elements = components.map((c) => (
    <FeedElement component={c.component} time={c.time} title={c.title} />
  ));
  return (
    <FeedWrapper>
      <SimpleBar className="simple_bar">
        <BrilliantFeedStyled>
          <h1>{"Good Morning, " + user.get_first_name()}</h1>
          {feed_elements}
        </BrilliantFeedStyled>
      </SimpleBar>
    </FeedWrapper>
  );
}
