import { Conditional } from '@components';
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
    return (
        <>
            <Conditional isRendered={!!isSerialized}>
                <a
                    className='text-link underline'
                    href={url}
                    rel='noopener noreferrer' 
                    target='_blank'
                    {...attributes}
                >
                    {children}
                </a>
            </Conditional>
        
            <Conditional isRendered={!isSerialized}>
                <span className='text-link'>
                    {children}
                </span>
            </Conditional>
        </>
    );
};