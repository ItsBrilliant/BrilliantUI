import React, { useState } from "react";
import FeedElement from "./FeedElement";
import FeedComponent from "./FeedComponent";
import { BrilliantFeedStyled, FeedWrapper } from "./Feed.style";
import SimpleBar from "simplebar-react";
import {
  NextMeeting,
  UrgentEmails,
  OverdueTasks,
  UnfinishedDrafts,
  QuickReplyFeed,
} from "./FeedExamples";
import { IMPORTANT, URGENT } from "../../data_objects/Consts";
import { useSelector } from "react-redux";
import { is_same_day, format_date } from "../../utils";
import {
  get_slots,
  add_feed_component,
  fill_meetings,
  is_short_email,
} from "./utils";
import { useEmailsHead } from "../../hooks/redux";
import TaskInfoWrapper from "../tasks/SingleTaskInfo";
import { now } from "moment";

let NOW = new Date()
NOW.setMinutes(0)
NOW.setSeconds(0)
const INTERVAL = 30;

export default function BrilliantFeed() {
  const user = useSelector((state) => state.user);
  let events = useSelector((state) => state.events);
  const [selected_task_id, set_task_id] = useState(undefined);
  const head_emails = useEmailsHead();
  const slots = get_slots(NOW, INTERVAL);
  events = events.filter((e) => is_same_day(NOW, e.start));
  events = events.sort((a, b) => a.start - b.start);
  let feed_components = allocate_meeting_component_slots(slots, events);
  const components = generate_example_components(head_emails, set_task_id);
  for (const component of components) {
    add_feed_component(feed_components, component);
  }
  let feed_elements = [];
  for (let i = 0; i < feed_components.length; i++) {
    const item = feed_components[i];
    if (item === undefined) {
      continue;
    } else {
      const time = format_date(slots[i]).time;
      feed_elements.push(
        <FeedElement
          component={item.component}
          time={time}
          title={item.title}
        />
      );
    }
  }
  return (
    <FeedWrapper>
      <TaskInfoWrapper
        thread_id={undefined}
        task_id={selected_task_id}
        close={() => set_task_id(undefined)}
      />
      <SimpleBar className="simple_bar">
        <BrilliantFeedStyled>
          <h1>{"Good Morning, " + user.get_first_name()}</h1>
          {feed_elements}
        </BrilliantFeedStyled>
      </SimpleBar>
    </FeedWrapper>
  );
}

function allocate_meeting_component_slots(slots, events) {
  const meetings_slots = fill_meetings(slots, events);
  let feed_array_with_meetings = Array(meetings_slots.length);
  for (let i = 0; i < meetings_slots.length; i++) {
    if (meetings_slots[i] !== undefined) {
      feed_array_with_meetings[i] = {
        component: <NextMeeting event={meetings_slots[i]} />,
        title: "Your next meeting",
      };
    }
  }
  return feed_array_with_meetings;
}

function generate_example_components(head_emails, select_task) {
  let short_emails = head_emails.filter((e) => is_short_email(e));
  short_emails = short_emails.sort((a, b) => b.date - a.date);
  short_emails = short_emails.slice(0, 5);
  return [
    {
      component: <UrgentEmails priority={URGENT} emails={head_emails} />,
      title: "Catch up on some urgent emails",
    },
    {
      component: (
        <QuickReplyFeed
          emails={short_emails}
          remove_email={() => alert("removed")}
        />
      ),
      title: "Reply to some short emails",
    },

    {
      component: (
        <OverdueTasks
          on_select={select_task}
          reference_time={NOW}
          priority={URGENT}
        />
      ),
      title: "These urgent tasks are due today",
    },

    {
      component: <UnfinishedDrafts emails={head_emails} />,
      title: "You have unfinished drafts in you mailbox",
    },
    {
      component: <UrgentEmails priority={IMPORTANT} emails={head_emails} />,
      title: "Catch up on some important emails",
    },
    {
      component: (
        <OverdueTasks
          on_select={select_task}
          reference_time={NOW}
          priority={IMPORTANT}
        />
      ),
      title: "These important tasks are due today",
    },
  ];
}
