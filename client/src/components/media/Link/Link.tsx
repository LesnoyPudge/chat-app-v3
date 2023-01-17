import { twClassNames } from '@utils';
import { FC, PropsWithChildren } from 'react';



interface Link extends PropsWithChildren {
    className?: string;
    href: string;
}

export const Link: FC<Link> = ({
    className = '',
    href,
    children,
}) => {
    return (
        <a 
            className={twClassNames('inline-block', className)}
            href={href} 
            rel='noopener noreferrer' 
            target='_blank'
        >
            {children}
        </a>
    );
};