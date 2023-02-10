import { Scrollable } from '@components';
import { FC, PropsWithChildren } from 'react';



const styles = {
    wrapper: 'grow shrink-0 basis-[218px] bg-primary-300',
    inner: 'h-full',
    content: 'ml-auto w-[240px] py-[60px] pl-5 pr-1.5',
};

export const FullScreenModalNavigationSide: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className={styles.wrapper}>
            <Scrollable className={styles.inner}>
                <div className={styles.content}>
                    {children}
                </div>
            </Scrollable>
        </div>
    );
};