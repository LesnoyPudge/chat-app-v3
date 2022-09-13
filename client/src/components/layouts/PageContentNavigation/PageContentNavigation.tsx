import { FC, PropsWithChildren } from 'react';



interface IPageContentNavigation extends PropsWithChildren {
    className?: string;
}

export const PageContentNavigation: FC<IPageContentNavigation> = ({ children, className = '' }) => {
    return (
        <div className={`flex flex-col bg-primary-300 w-[240px] ${className}`}>
            {children}
        </div>
    );
};