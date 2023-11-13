import { isProd } from '@utils';
import { FC, PropsWithChildren, useEffect } from 'react';



interface ToDo extends PropsWithChildren {
    text?: string;
}

export const ToDo: FC<ToDo> = ({
    text,
    children,
}) => {
    useEffect(() => {
        if (isProd()) return;
        console.warn(`ToDo: ${text}`);
    }, [text]);

    return (
        <>
            {children}
        </>
    );
};