export const Update = (tasks) => {
  if (!Array.isArray(tasks)) {
    tasks = [tasks];
  }
  return {
    type: "UPDATE_TASKS",
    tasks: tasks,
  };
};

export const Delete = (ids) => {
  if (!Array.isArray(ids)) {
    ids = [ids];
  }
  return {
    type: "DELETE_TASKS",
    ids: ids,
  };
};

export const SelectTask = (id) => {
  return {
    type: "SELECT_TASK",
    id: id,
  };
};
