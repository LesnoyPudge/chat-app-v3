import { FC, ReactNode } from 'react';
import { RenderElementAttributes } from '../../types';



type LinkPropsType = {
   isSerialized: true;
   children: ReactNode;
   url: string;
   attributes?: never;
} | {
    isSerialized?: never;
    children: ReactNode;
    url: string;
    attributes: RenderElementAttributes;
}

export const Link: FC<LinkPropsType> = ({
    isSerialized,
    url,
    children,
    attributes,
}) => {
    const Serialized = () => (
        <a
            className='text-link underline'
            href={url}
            target='_blank' 
            rel='noreferrer' 
            {...attributes}
        >
            {children}
        </a>
    );

    const Unserialized = () => (
        <span className='text-link'>
            {children}
        </span>
    );

    const content = isSerialized ? Serialized() : Unserialized();

    return content;
};