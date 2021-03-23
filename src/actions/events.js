export const ExpandEvents = (events) => {
  return {
    type: "EXPAND_EVENTS",
    events: events,
  };
};

export const ResetEvents = () => {
  return {
    type: "RESET_EVENTS",
  };
};
