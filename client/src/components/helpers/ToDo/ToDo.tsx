import { getEnv } from '@utils';
import { FC, PropsWithChildren, useEffect } from 'react';



interface ToDo extends PropsWithChildren {
    text?: string;
}

const { CUSTOM_NODE_ENV } = getEnv();

export const ToDo: FC<ToDo> = ({
    text,
    children,
}) => {
    useEffect(() => {
        if (CUSTOM_NODE_ENV === 'production') return;
        console.warn(`ToDo: ${text}`);
    }, [text]);

    return (
        <>
            {children}
        </>
    );
};