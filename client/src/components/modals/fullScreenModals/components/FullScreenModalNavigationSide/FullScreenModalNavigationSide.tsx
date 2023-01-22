import { FC, PropsWithChildren } from 'react';



const styles = {
    wrapper: 'grow shrink-0 basis-[218px] bg-primary-300',
    inner: `flex h-full justify-end overflow-x-hidden 
    overflow-y-scroll scrollbar-primary `,
    content: 'w-60 py-[60px] pl-5 pr-1.5 h-fit',
};

export const FullScreenModalNavigationSide: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.inner}>
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        </div>
    );
};