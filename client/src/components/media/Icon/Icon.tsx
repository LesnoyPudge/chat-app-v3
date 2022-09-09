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
    height = 30, 
    width = 30, 
    className = '', 
}) => {
    return (
        <>
            <svg className={`fill-icon ${className}`} width={width} height={height}>
                <use xlinkHref={`${sprite}#${iconId}`}></use>
            </svg>
        </>
    );
};