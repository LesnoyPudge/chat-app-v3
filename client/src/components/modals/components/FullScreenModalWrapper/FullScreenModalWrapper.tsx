import { FC, PropsWithChildren } from 'react';



export const FullScreenModalWrapper: FC<PropsWithChildren> = ({
    children,
}) => {
    return (
        <div className='flex h-screen w-screen bg-primary-200'>
            {children}
        </div>
    );
};