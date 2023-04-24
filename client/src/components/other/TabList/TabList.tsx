import { PropsWithChildrenAndClassName, PropsWithInnerRef } from '@types';
import { FC } from 'react';



interface TabList extends PropsWithChildrenAndClassName, 
PropsWithInnerRef<HTMLDivElement> {
    label: string
    orientation?: 'vertical' | 'horizontal';
}

export const TabList: FC<TabList> = ({
    className = '',
    label,
    orientation = 'vertical',
    innerRef,
    children,
}) => {
    return (
        <div 
            className={className}
            role='tablist' 
            aria-orientation={orientation}
            aria-label={label}
            ref={innerRef}
        >
            {children}
        </div>
    );
};