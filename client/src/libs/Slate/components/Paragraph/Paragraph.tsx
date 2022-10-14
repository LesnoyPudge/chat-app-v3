import { FC, ReactNode } from 'react';
import { RenderElementAttributes } from '../../types';



type ParagraphPropsType = {
    isSerialized: true;
    children: ReactNode;
    attributes?: never;
} | {
    isSerialized?: never;
    children: ReactNode;
    attributes: RenderElementAttributes;
}

export const Paragraph: FC<ParagraphPropsType> = ({
    attributes,
    children,
}) => {

    return (
        <p {...attributes}>
            {children}
        </p>
    );
};