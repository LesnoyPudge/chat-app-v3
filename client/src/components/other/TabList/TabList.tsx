import { PropsWithChildrenAndClassName } from '@types';
import { FC } from 'react';



interface TabList extends PropsWithChildrenAndClassName {
    label: string
    orientation?: 'vertical' | 'horizontal';
}

export const TabList: FC<TabList> = ({
    className = '',
    label,
    orientation = 'vertical',
    children,
}) => {
    return (
        <div 
            className={className}
            role='tablist' 
            aria-orientation={orientation}
            aria-label={label}
        >
            {children}
        </div>
    );
};