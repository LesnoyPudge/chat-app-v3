import classNames from 'classnames';
import { FC, PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';



interface IPageContent extends PropsWithChildren {
    className?: string;
}

const baseClassName = 'flex flex-col bg-primary-200 w-full flex-1 overflow-hidden';

export const PageContent: FC<IPageContent> = ({ 
    className = '',
    children, 
}) => {
    return (
        <div className={twMerge(classNames(baseClassName, className))}>
            {children}
        </div>
    );
};