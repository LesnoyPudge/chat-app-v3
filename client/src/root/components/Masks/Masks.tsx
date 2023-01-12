import { FC } from 'react';



export const Masks: FC = () => {
    const commonAttributes = {
        maskContentUnits: 'objectBoundingBox', 
        viewBox: '0 0 1 1',
    };

    return (
        <svg 
            className='sr-only'
            viewBox='0 0 1 1' 
            aria-hidden='true'
        >
            <mask id='avatar-with-status-mask' {...commonAttributes}>
                <circle fill='white' cx='0.5' cy='0.5' r='0.5'></circle>
                <circle fill='black' cx='0.84375' cy='0.84375' r='0.25'></circle>
            </mask>

            <mask id='afk-status-mask' {...commonAttributes}>
                <circle fill='white' cx='0.5' cy='0.5' r='0.5'></circle>
                <circle fill='black' cx='0.2' cy='0.2' r='0.45'></circle>
            </mask>

            <mask id='offline-status-mask' {...commonAttributes}>
                <circle fill='white' cx='0.5' cy='0.5' r='0.5'></circle>
                <circle fill='black' cx='0.5' cy='0.5' r='0.25'></circle>
            </mask>

            <mask id='dnd-status-mask' {...commonAttributes}>
                <circle fill='white' cx='0.5' cy='0.5' r='0.5'></circle>
                <rect fill='black' x='0.13' y='0.38' width='0.75' height='0.25' rx='0.1' ry='0.25'></rect>
            </mask>
        </svg>
    );
};