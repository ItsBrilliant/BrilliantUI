import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

export function useSearchResultSelect(url, action) {
  const history = useHistory();
  const disptach = useDispatch();
  return (item) => {
    disptach(action(item));
    history.push(url);
  };
}
