import { Contact } from "../../data_objects/Contact";
import { format_date } from "../../utils";

export function get_slots(now, minutes_interval) {
  const hour = now.getHours();
  const month = now.getMonth();
  const date = now.getDate();
  const year = now.getYear() + 1900;
  var slots = [];
  let slot = new Date(year, month, date, hour);
  while (slot.getHours() < 18) {
    slots.push(slot);
    slot = new Date(slot.getTime() + minutes_interval * 60000);
  }
  return slots;
}

export function fill_meetings(slots, events) {
  let res = Array(slots.length);
  for (const event of events) {
    const slot_index = find_closest_slot(slots, event.start);
    if (res[slot_index] === undefined) {
      res[slot_index] = event;
    }
  }
  return res;
}

function find_closest_slot(slots, time) {
  for (let i = 0; i < slots.length; i++) {
    if (slots[i] <= time) {
      if (slots[i + 1] === undefined || slots[i + 1] > time) {
        return i;
      }
    }
  }
}

export function add_feed_component(arr, component) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === undefined) {
      arr[i] = component;
      return true;
    }
  }
  return false;
}

export function is_short_email(email, user, max_characters = 80) {
  if (
    email.is_draft() ||
    email.is_deleted() ||
    email.get_sender() === Contact.CURRENT_USER
  ) {
    return false;
  }
  const text = email.get_text();
  return text.length <= max_characters;
}
