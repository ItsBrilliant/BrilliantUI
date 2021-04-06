import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

export function useSearchResultSelect(url, action) {
    const history = useHistory();
    const disptach = useDispatch();
    return (item) => {
        if (action) {
            disptach(action(item));
        }
        if (url) {
            history.push(url);
        }
    };
}
