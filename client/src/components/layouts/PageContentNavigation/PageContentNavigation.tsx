import { FC, PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';



interface IPageContentNavigation extends PropsWithChildren {
    className?: string;
}

export const PageContentNavigation: FC<IPageContentNavigation> = ({ children, className = '' }) => {
    return (
        <div className={twMerge(`flex flex-col bg-primary-300 w-[240px] ${className}`)}>
            {children}
        </div>
    );
};