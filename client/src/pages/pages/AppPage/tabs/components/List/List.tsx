import { twClassNames } from '@utils';
import { FC, PropsWithChildren } from 'react';



interface IList extends PropsWithChildren {
    className?: string;
}

const baseClassName = `flex flex-col w-full h-full 
overflow-x-hidden overflow-y-scroll relative`;

export const List: FC<IList> = ({
    className = '',
    children,
}) => {
    return (
        <div 
            className={twClassNames(baseClassName, className)}
        >
            <ul className='absolute w-full pr-2.5'>
                {children}
            </ul>
        </div>
    );
};