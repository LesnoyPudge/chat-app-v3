import { FC, PropsWithChildren } from 'react';



interface ITopBar extends PropsWithChildren {
    className?: string;
}

export const TopBar: FC<ITopBar> = ({ children, className = '' }) => {
    return (
        <div className={`p-2.5 shadow-top_bar ${className}`}>
            {children}
        </div>
    );
};