import { twClassNames } from '@utils';
import { FC, PropsWithChildren } from 'react';



interface IListHeading extends PropsWithChildren {
    className?: string;
    isFiltred: boolean,
    filtredListlength: number
}

const baseClassName = 'uppercase text-sm text-secondary flex gap-2 mb-3';

export const ListHeading: FC<IListHeading> = ({
    className = '', 
    children,
    isFiltred,
    filtredListlength,
}) => {
    return (
        <h3 className={twClassNames(baseClassName, className)}>
            <span>{children}</span>

            {isFiltred && <span>Показано — {filtredListlength}</span>}
        </h3>
    );
};