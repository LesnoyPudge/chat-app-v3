import { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import SVG from 'react-inlinesvg';
import { useToggle } from '@hooks';



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
        <div 
            className={twMerge(`transition-all flex flex-shrink-0 ${className}`)}
            style={{ width, height }}
        >
            <SVG
                src={`/src/assets/icons/${iconId}.svg`} 
                width={width} 
                height={height}
                cacheRequests
            />
        </div>
    );
};