import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';
import { RenderElementAttributes } from '../../types';



type SlateParagraph = PropsWithChildrenAndClassName & ({
    serialized?: never;
    attributes: RenderElementAttributes;
} | {
    serialized: true;
    attributes?: never;
})

export const SlateParagraph: FC<SlateParagraph> = ({
    className = '',
    attributes,
    serialized,
    children,
}) => {
    const Tag = serialized ? 'span' : 'p';

    return (
        <Tag 
            className={twClassNames(className)}
            {...attributes}
        >
            {children}
        </Tag>
    );
};