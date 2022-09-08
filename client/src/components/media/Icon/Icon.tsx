import { FC } from 'react';
import sprite from '@assets/sprite.svg';
import classNames from 'classnames';



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
    const iconCN = classNames({
        'icon-accent': true,
        [className]: !!className,
    });

    return (
        <>
            <svg className={iconCN} width={width} height={height}>
                <use xlinkHref={`${sprite}#${iconId}`}></use>
            </svg>
        </>
    );
};