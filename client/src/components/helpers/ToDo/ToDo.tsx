import { getEnv } from '@utils';
import { FC, PropsWithChildren } from 'react';
import { useEffectOnce } from 'usehooks-ts';



interface ToDo extends PropsWithChildren {
    text?: string;
}

const { CUSTOM_NODE_ENV } = getEnv();

export const ToDo: FC<ToDo> = ({
    text,
    children,
}) => {
    useEffectOnce(() => {
        if (CUSTOM_NODE_ENV !== 'development') return;
        console.warn(`ToDo: ${text}`);
    });

    return (
        <>
            {children}
        </>
    );
};