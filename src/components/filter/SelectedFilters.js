import { useSelector, useDispatch } from 'react-redux';
import { RemoveFilter } from '../../actions/filter';

export default function SelectedFilters(props) {
    const dispatch = useDispatch();
    const filters = useSelector((state) => state.filters);
    let filter_arr = [];
    for (const key in filters) {
        filter_arr.push({ type: key, value: filters[key] });
    }
    const result = filter_arr.map((f) => (
        <SelectedFilter
            key={f.value}
            text={f.value}
            remove={() => dispatch(RemoveFilter(f.type))}
        ></SelectedFilter>
    ));
    return result;
}

function SelectedFilter(props) {
    return (
        <div>
            <span>{props.text}</span>
            <button onClick={props.remove}>&times;</button>
        </div>
    );
}
