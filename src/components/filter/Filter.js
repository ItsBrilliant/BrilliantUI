import { useDispatch } from 'react-redux';
import { SetFilter } from '../../actions/filter';
import OptionsButton from '../OptionsButton';
import SelectedFilters from './SelectedFilters';

export default function Filter(props) {
    const dispatch = useDispatch();
    const open_priority = () => dispatch(SetFilter('priority', 'Important'));
    const open_tags = () => dispatch(SetFilter('tag', 't1'));
    const options = [
        { name: 'Priority', action: open_priority },
        { name: 'Tags', action: open_tags },
    ];
    return (
        <div>
            <button className="filter_button">
                Filter
                <OptionsButton options={options} />
            </button>
            <SelectedFilters />
        </div>
    );
}
