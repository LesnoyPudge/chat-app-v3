import { PropsWithChildrenAndClassName } from '@types';
import { FC } from 'react';
import { Conditional } from '@components';
import { twClassNames } from '@utils';



interface ErrorBlock extends PropsWithChildrenAndClassName {
    isError: boolean;
}

const baseClassName = 'bg-danger text-white rounded font-semibold px-2 py-1.5';

export const ErrorBlock: FC<ErrorBlock> = ({
    className = '',
    isError,
    children,
}) => {
    return (
        <Conditional isRendered={isError}>
            <div className={twClassNames(baseClassName, className)}>
                {children}
            </div>
        </Conditional>
    );
};