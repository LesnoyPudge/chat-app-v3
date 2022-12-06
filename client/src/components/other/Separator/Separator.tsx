import { twClassNames } from '@utils';
import { CSSProperties, FC } from 'react';



interface ISeparator {
    className?: string;
    spacing?: number;
    thikness?: number;
    height?: number;
    orientation?: 'horizontal' | 'vertical';
}

const orientations = {
    vertical: 'h-[var(--height)] w-[var(--thikness)] my-auto mx-[var(--spacing)]',
    horizontal: 'w-full h-[var(--thikness)] mx-auto my-[var(--spacing)]',
};

export const Separator: FC<ISeparator> = ({ 
    className = '', 
    spacing = 8, 
    thikness = 2, 
    height = 10,
    orientation = 'horizontal',
}) => {
    const style = {
        '--spacing': `${spacing}px`,
        '--thikness': `${thikness}px`,
        '--height': `${height}px`,
    } as CSSProperties;
    
    return (
        <div 
            className={twClassNames(
                'shrink-0 bg-primary-100', 
                {
                    [orientations[orientation]]: true,
                    [className]: !!className,
                },
            )}
            style={style}
        ></div>
    );
};