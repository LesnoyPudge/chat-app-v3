import { FC } from 'react';



interface ISeparator {
    className?: string;
}

export const Separator: FC<ISeparator> = ({ className = '' }) => {
    return (
        <div 
            className={`bg-primary-100 w-1/2 h-[2px] mx-auto my-2 ${className}`}
        ></div>
    );
};