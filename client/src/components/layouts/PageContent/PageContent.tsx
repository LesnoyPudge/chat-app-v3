import { FC, PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';



interface IPageContent extends PropsWithChildren {
    className?: string;
}

export const PageContent: FC<IPageContent> = ({ children, className = '' }) => {
    return (
        <div className={twMerge(`flex flex-col bg-primary-200 w-full flex-1 ${className}`)}>
            {children}
        </div>
    );
};