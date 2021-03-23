import { useSelector } from "react-redux";

export function useTasks(filter_by, value, func = (a, b) => a === b) {
  let tasks_dict = useSelector((state) => state.tasks);
  let tasks = Object.values(tasks_dict);
  if (filter_by) {
    tasks = tasks.filter((t) => {
      if (typeof filter_by === "string") {
        return func(t[filter_by], value);
      } else {
        // Multiple filters
        for (let i = 0; i < filter_by.length; i++) {
          const f = func[i] ? func[i] : (a, b) => a === b;
          if (!f(t[filter_by[i]], value[i])) {
            return false;
          }
        }
        return true;
      }
    });
  }
  return tasks;
}

export function useThreads(priority) {
  let threads_dict = useSelector((state) => state.email_threads);
  let threads = Object.values(threads_dict);
  threads = threads.filter(
    (t) => priority === undefined || t.get_priority() === priority
  );
  return threads;
}

export function useEmails(prority) {
  const threads = useThreads();
  let res = [];
  for (const thread of threads) {
    for (const email of thread.get_emails()) {
      res.push(email);
    }
  }
  return res;
}
