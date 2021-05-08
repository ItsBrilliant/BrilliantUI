import React from 'react';
import { link_hover_color } from './StyleConsts';
export const MailIcon = (props) => {
    var forward_props = Object.assign(
        { color: '#F4F6FB', width: '17', height: '14' },
        props
    );
    return (
        <GeneralSvg
            path_d="M1.03733 1.02513C0 2.05025 0 3.70017 0 7C0 10.2998 0 11.9497 1.03733 12.9749C2.07466 14 3.74422 14 7.08333 14H9.91667C13.2558 14 14.9253 14 15.9627 12.9749C17 11.9497 17 10.2998 17 7C17 3.70017 17 2.05025 15.9627 1.02513C14.9253 0 13.2558 0 9.91667 0H7.08333C3.74422 0 2.07466 0 1.03733 1.02513ZM15.1298 3.80141C15.411 3.63604 15.5833 3.33655 15.5833 3.01316C15.5833 2.30169 14.7992 1.86109 14.1805 2.22492L9.22459 5.13929C8.77817 5.40181 8.22217 5.40181 7.77574 5.13931L2.81947 2.22488C2.20076 1.86107 1.41667 2.30167 1.41667 3.01315C1.41667 3.33655 1.58899 3.63604 1.87021 3.80141L7.77557 7.27401C8.222 7.53652 8.778 7.53652 9.22442 7.27401L15.1298 3.80141Z"
            viewBox={'0 0 17 14'}
            {...forward_props}
        />
    );
};
export const ClockIcon = (props) => {
    const [width, height] = ['18', '18'];
    var forward_props = Object.assign(
        { color: '#565F80', width: width, height: height },
        props
    );
    return (
        <GeneralSvg
            path_d="M9.00001 0.669189C4.41667 0.669189 0.666672 4.41919 0.666672 9.00252C0.666672 13.5859 4.41667 17.3359 9.00001 17.3359C13.5833 17.3359 17.3333 13.5859 17.3333 9.00252C17.3333 4.41919 13.5833 0.669189 9.00001 0.669189ZM12.5 12.5025L8.16667 9.83586V4.83586H9.41667V9.16919L13.1667 11.4192L12.5 12.5025Z"
            viewBox={`0 0 ${width} ${height}`}
            {...forward_props}
        />
    );
};

export const GeneralSvg = (props) => (
    <svg width={props.width} height={props.height} viewBox={props.viewBox}>
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d={props.path_d}
            fill={props.color}
            stroke={props.stroke}
            stroke-width={props.strokeWidth}
        />
    </svg>
);

export const TaskIcon = () => (
    <svg
        width="15"
        height="18"
        viewBox="0 0 15 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M7.19986 0C5.87438 0 4.79986 1.07451 4.79986 2.4H4.20014H2C0.895431 2.4 0 3.29543 0 4.39999V16C0 17.1046 0.895432 18 2 18H12.4C13.5046 18 14.4 17.1046 14.4 16V4.4C14.4 3.29543 13.5046 2.4 12.4 2.4H10.2001L9.59986 2.4C9.59986 1.07452 8.52535 0 7.19986 0ZM4.20014 4.20001V6H10.2001V4.20001H12.5992V16.2H1.79917V4.20001H4.20014ZM7.19917 3.29999C7.69623 3.29999 8.09917 2.89705 8.09917 2.39999C8.09917 1.90293 7.69623 1.49999 7.19917 1.49999C6.70212 1.49999 6.29917 1.90293 6.29917 2.39999C6.29917 2.89705 6.70212 3.29999 7.19917 3.29999Z"
            fill="#F4F6FB"
        />
    </svg>
);

export const CalendarIcon = () => (
    <svg
        width="15"
        height="17"
        viewBox="0 0 15 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M2.46145 0.5H4.30737V2.34795H10.4601V0.5H12.306V2.39617C13.7058 2.64994 14.7674 3.87497 14.7674 5.34795V13.5C14.7674 15.1568 13.4242 16.5 11.7674 16.5H3C1.34314 16.5 0 15.1568 0 13.5V5.34795C0 3.87494 1.06161 2.64989 2.46145 2.39616V0.5ZM13.5369 6.65372H1.23073V14.6527H13.5369V6.65372ZM2.46145 8.49761H4.92268V10.3435H2.46145V8.49761ZM8.61485 8.49761H6.15363V10.3435H8.61485V8.49761ZM2.46145 11.5755H4.92268V13.4214H2.46145V11.5755ZM8.61485 11.5755H6.15363V13.4214H8.61485V11.5755ZM9.8447 8.49761H12.3059V10.3435H9.8447V8.49761ZM12.3059 11.5755H9.8447V13.4214H12.3059V11.5755Z"
            fill="#F4F6FB"
        />
    </svg>
);

export const ContactIcon = (props) => {
    var forward_props = Object.assign(
        { color: '#F4F6FB', width: '15', height: '17' },
        props
    );
    return (
        <GeneralSvg
            path_d="M12.9231 2.34615H12.3077V0.5H10.4615V2.34615H4.30769V0.5H2.46154V2.34615H1.84615C0.935385 2.34615 0 3.24462 0 4.19231V14.6538C0 15.6015 0.935385 16.5 1.84615 16.5H12.9231C13.8256 16.5 14.7692 15.6015 14.7692 14.6538V4.19231C14.7692 3.24462 13.8256 2.34615 12.9231 2.34615ZM7.38496 4.80769C8.74701 4.80769 9.8465 5.90717 9.8465 7.26923C9.8465 8.63128 8.74701 9.73076 7.38496 9.73076C6.02291 9.73076 4.92342 8.63128 4.92342 7.26923C4.92342 5.90717 6.02291 4.80769 7.38496 4.80769ZM12.3073 14.0385H2.46119V13.1379C2.46119 11.3368 5.74325 10.3462 7.38427 10.3462C9.0253 10.3462 12.3073 11.3368 12.3073 13.1379V14.0385Z"
            viewBox={'0 0 15 17'}
            {...forward_props}
        />
    );
};

export const UserIcon = (props) => {
    var forward_props = Object.assign(
        { color: '#F4F6FB', width: '17', height: '16' },
        props
    );
    return (
        <GeneralSvg
            path_d="M8.50016 8.79167C10.6852 8.79167 12.4585 7.01992 12.4585 4.83333C12.4585 2.64675 10.6852 0.875 8.50016 0.875C6.31358 0.875 4.54183 2.64675 4.54183 4.83333C4.54183 7.01992 6.31358 8.79167 8.50016 8.79167ZM10.1304 10.375C13.1628 10.375 15.6901 12.3985 16.4168 15.125H0.583496C1.31023 12.3985 3.8375 10.375 6.87153 10.375H10.1304Z"
            viewBox={'0 0 17 16'}
            {...forward_props}
        />
    );
};

export const PriorityIcon = (props) => {
    const [width, height] = ['16', '13'];
    var forward_props = Object.assign(
        { color: '#F4F6FB', width: width, height: height },
        props
    );
    return (
        <GeneralSvg
            path_d="M9.59983 2.10112H15.9999V3.70114H9.59983V2.10112ZM9.59983 6.50007H15.9999V8.10008H9.59983V6.50007ZM9.59983 10.899H15.9999V12.499H9.59983V10.899ZM0 7.30007C0 4.43604 2.33603 2.10002 5.20006 2.10002H5.60006V0.5L8.00009 2.90003L5.60006 5.30005V3.70003H5.20006C3.21603 3.70003 1.60002 5.31605 1.60002 7.30007C1.60002 9.2841 3.21603 10.9001 5.20006 10.9001H8.00009V12.5001H5.20006C2.33603 12.5001 0 10.1641 0 7.30007Z"
            viewBox={`0 0 ${width} ${height}`}
            {...forward_props}
        />
    );
};

export const FileIcon = () => (
    <svg
        width="15"
        height="17"
        viewBox="0 0 17 27"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M6.53846 27C2.75008 27 0 24.0261 0 19.9286V9C0 3.86871 3.65369 0 8.5 0C13.3463 0 17 3.86871 17 9V18H14.3846V9C14.3846 5.27529 11.9092 2.57143 8.5 2.57143C5.09085 2.57143 2.61538 5.27529 2.61538 9V19.9286C2.61538 22.1696 3.82892 24.4286 6.53846 24.4286C9.248 24.4286 10.4615 22.1696 10.4615 19.9286V10.2857C10.4615 9.51171 10.2706 7.71429 8.5 7.71429C6.72938 7.71429 6.53846 9.51171 6.53846 10.2857V19.2857H3.92308V10.2857C3.92308 7.209 5.763 5.14286 8.5 5.14286C11.237 5.14286 13.0769 7.209 13.0769 10.2857V19.9286C13.0769 24.0261 10.3268 27 6.53846 27Z"
            fill="#F4F6FB"
        />
    </svg>
);

export const FilterIcon = () => (
    <svg
        width="20"
        height="13"
        viewBox="0 0 20 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M7.99976 13H11.9998V10H7.99976V13ZM-0.000244141 0V3H19.9998V0H-0.000244141ZM2.99976 8H16.9998V5H2.99976V8Z"
            fill="#BDC8DF"
        />
    </svg>
);

export const TagIcon = (props) => {
    const [width, height] = ['16', '16'];
    var forward_props = Object.assign(
        { color: '#F4F6FB', width: width, height: height },
        props
    );
    return (
        <GeneralSvg
            path_d="M15.7656 5.03454L10.9656 0.234597C10.6528 -0.078199 10.1472 -0.078199 9.83443 0.234597L0.234548 9.83448C0.00575132 10.0633 -0.0630478 10.4073 0.0609506 10.7065C0.184949 11.0049 0.476945 11.2001 0.800141 11.2001H4.80009V15.2C4.80009 15.5232 4.99529 15.8152 5.29369 15.9392C5.39288 15.98 5.49688 16 5.60008 16C5.80808 16 6.01288 15.9184 6.16567 15.7656L15.7656 6.16572C16.0784 5.85293 16.0784 5.34733 15.7656 5.03454Z"
            viewBox={`0 0 ${width} ${height}`}
            {...forward_props}
        />
    );
};

export const VIcon = (props) => {
    const [width, height] = ['24', '20'];
    var forward_props = Object.assign(
        { color: link_hover_color, width: width, height: height },
        props
    );
    return (
        <GeneralSvg
            path_d="M24.0001 3.08103L7.67109 20L6.10352e-05 12.0518L2.97365 8.97077L7.67109 13.8379L21.0265 0L24.0001 3.08103Z"
            viewBox={`0 0 ${width} ${height}`}
            {...forward_props}
        />
    );
};

export const LineIcon = (props) => {
    const [width, height] = [props.width || '289', props.height || '2'];
    const color = props.color || '#2C3554';
    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            xmlns="http://www.w3.org/2000/svg"
        >
            <line
                x1="0.5"
                y1="0.999889"
                x2="289"
                y2="0.999864"
                stroke={color}
                stroke-width="2"
            />
        </svg>
    );
};
export const ChevronIcon = (props) => {
    const [width, height] = ['15', '9'];
    var forward_props = Object.assign(
        {
            color: 'transparent',
            stroke: '#565F80',
            strokeWidth: '2',
            width: width,
            height: height,
        },
        props
    );
    return (
        <GeneralSvg
            path_d="M1.5 0.999877L7.5 6.99988L13.5 0.999878"
            viewBox={`0 0 ${width} ${height}`}
            {...forward_props}
        />
    );
};

export const VerticalDots = (props) => {
    const width = props.width || '15';
    const height = props.height || '17';
    const color = props.color || '#3C4566';
    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g clip-path="url(#clip0)">
                <circle cx="11" cy="2.00146" r="2" fill={color} />
                <circle cx="11" cy="8.00146" r="2" fill={color} />
                <circle cx="11" cy="14.0015" r="2" fill={color} />
            </g>
            <defs>
                <clipPath id="clip0">
                    <rect
                        width="15"
                        height="16"
                        fill="white"
                        transform="translate(0 0.00146484)"
                    />
                </clipPath>
            </defs>
        </svg>
    );
};
