import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';
import { RenderElementAttributes } from '../../types';



type SlateLink = PropsWithChildrenAndClassName & {
    url: string;
} & ({
    serialized?: never;
    attributes: RenderElementAttributes;
} | {
    serialized: true;
    attributes?: never;
})

const baseClassName = 'text-color-link';

export const SlateLink: FC<SlateLink> = ({
    className = '',
    url,
    attributes,
    children,
}) => {
    return (
        <span 
            className={twClassNames(baseClassName, className)} 
            data-url={url}
            {...attributes}
        >
            {children}
        </span>
    );
};