import { FC } from 'react';
import sprite from '@assets/sprite.svg';
import { twMerge } from 'tailwind-merge';



interface IIcon {
    className?: string;
    iconId: string;
    width?: number;
    height?: number;
}

export const Icon: FC<IIcon> = ({ 
    iconId, 
    height, 
    width, 
    className = '', 
}) => {
    return (
        <>
            <svg 
                className={twMerge(`transition-all flex flex-shrink-0 ${className}`)} 
                width={width} 
                height={height}
            >
                <use xlinkHref={`${sprite}#${iconId}`}></use>
            </svg>
        </>
    );
};