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

export const SelectCalendarDate = (date) => {
  return {
    type: "SELECT_DATE",
    date: date,
  };
};
