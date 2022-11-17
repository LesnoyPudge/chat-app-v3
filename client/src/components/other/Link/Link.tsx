import { twClassNames } from '@utils';
import { FC, PropsWithChildren } from 'react';



interface ILink extends PropsWithChildren {
    className?: string;
    href: string;
}

const baseCN = 'inline-block';

export const Link: FC<ILink> = ({
    className = '',
    href,
    children,
}) => {
    return (
        <a 
            className={twClassNames(baseCN, className)}
            href={href} 
            rel='noopener noreferrer' 
            target='_blank'
        >
            {children}
        </a>
    );
};