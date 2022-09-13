import { FC, PropsWithChildren } from 'react';



interface IPageContent extends PropsWithChildren {
    className?: string;
}

export const PageContent: FC<IPageContent> = ({ children, className = '' }) => {
    return (
        <div className={`flex flex-col bg-primary-200 w-full flex-1 ${className}`}>
            {children}
        </div>
    );
};