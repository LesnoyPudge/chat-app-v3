import { PropsWithChildrenAndClassName } from '@types';
import { FC } from 'react';



interface TabPanel extends PropsWithChildrenAndClassName {
    controls: string;
    label: string;
}

export const TabPanel: FC<TabPanel> = ({
    className = '',
    controls,
    label,
    children,
}) => {
    return (
        <div
            className={className}
            id={controls}
            aria-label={label}
            role='tabpanel'
        >
            {children}
        </div>
    );
};