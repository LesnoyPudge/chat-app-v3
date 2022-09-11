import { FC } from 'react';
import sprite from '@assets/sprite.svg';



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
                className={`transition-all ${className}`} 
                width={width} 
                height={height}
            >
                <use xlinkHref={`${sprite}#${iconId}`}></use>
            </svg>
        </>
    );
};