import { FC, PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';



interface IListHeading extends PropsWithChildren {
    className?: string;
    isFiltred: boolean,
    filtredListlength: number
}

export const ListHeading: FC<IListHeading> = ({
    className = '', 
    children,
    isFiltred,
    filtredListlength,
}) => {
    return (
        <h3 className={twMerge(`uppercase text-sm text-secondary flex gap-2 mb-3 ${className}`)}>
            <span>{children}</span>

            {isFiltred && <span>Показано — {filtredListlength}</span>}
        </h3>
    );
};