import { HeadingLevel } from '@libs';
import { PropsWithChildrenAndClassName } from '@types';
import { FC } from 'react';



export const Section: FC<PropsWithChildrenAndClassName> = ({
    className = '',
    children,
}) => {
    return (
        <HeadingLevel>
            <section className={className}>
                {children}
            </section>
        </HeadingLevel>
    );
};