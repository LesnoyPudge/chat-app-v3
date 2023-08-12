import { FC } from 'react';



export const Masks: FC = () => {
    return (
        <svg
            className='sr-only'
            viewBox='0 0 1 1'
            aria-hidden='true'
        >
            <mask id='avatar-with-status-mask' maskContentUnits='objectBoundingBox'>
                <circle fill='white' cx='0.5' cy='0.5' r='0.5'></circle>
                <circle fill='black' cx='0.84375' cy='0.84375' r='0.25'></circle>
            </mask>
        </svg>
    );
};