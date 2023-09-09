import { FC, PropsWithChildren } from 'react';



const styles = {
    wrapper: `flex h-screen w-screen bg-primary-200 relative 
    before:absolute before:inset-0 before:bg-inherit 
    before:scale-[2] before:-z-10`,
};

export const FullScreenModalWrapper: FC<PropsWithChildren> = ({
    children,
}) => {
    return (
        <div className={styles.wrapper}>
            {children}
        </div>
    );
};