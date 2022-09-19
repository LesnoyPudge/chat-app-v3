import { FC, PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';



interface IList extends PropsWithChildren {
    className?: string;
}

export const List: FC<IList> = ({
    className = '',
    children,
}) => {
    return (
        <div 
            className={twMerge(`flex flex-col w-full h-full overflow-x-hidden overflow-y-scroll relative custom-scrollbar-variant-primary ${className}`)}
        >
            <ul className='absolute w-full pr-2.5'>
                {children}
            </ul>
        </div>
    );
};