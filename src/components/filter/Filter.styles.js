import { brigher_background } from '../StyleConsts';
export const customStyles = {
    menuList: (provided, state) => ({
        ...provided,
        borderBottom: '1px dotted pink',
        backgroundColor: brigher_background,
        color: 'white',
        zIndex: 1001,
        position: 'absolute',
        left: 0,
        top: 0,
    }),
    control: () => ({
        // none of react-select's styles are passed to <Control />
        width: '500px',
        color: 'red',
        alignSelf: 'center',
    }),
};
