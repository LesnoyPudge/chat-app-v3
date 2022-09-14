import { FC, PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';



interface ITopBar extends PropsWithChildren {
    className?: string;
}

export const TopBar: FC<ITopBar> = ({ children, className = '' }) => {
    return (
        <div className={twMerge(`flex items-center h-12 shadow-top_bar ${className}`)}>
            {children}
        </div>
    );
};