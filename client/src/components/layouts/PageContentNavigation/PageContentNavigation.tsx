import classNames from 'classnames';
import { FC, PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';



interface IPageContentNavigation extends PropsWithChildren {
    className?: string;
}

const baseClassName = 'flex flex-col bg-primary-300 w-[240px] shrink-0 overflow-hidden';

export const PageContentNavigation: FC<IPageContentNavigation> = ({ 
    className = '',
    children,
}) => {
    return (
        <div className={twMerge(classNames(baseClassName, className))}>
            {children}
        </div>
    );
};