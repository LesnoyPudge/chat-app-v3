import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';
import { RenderElementAttributes } from '../../types';



interface SlateParagraph extends PropsWithChildrenAndClassName {
    attributes: RenderElementAttributes;
}

export const SlateParagraph: FC<SlateParagraph> = ({
    className = '',
    attributes,
    children,
}) => {
    return (
        <p 
            className={twClassNames(className)}
            {...attributes}
        >
            {children}
        </p>
    );
};