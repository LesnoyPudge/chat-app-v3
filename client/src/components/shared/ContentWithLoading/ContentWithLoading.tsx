import { FC, PropsWithChildren } from 'react';
import {  LoadingIndicator } from '@components';
import { twClassNames } from '@utils';



interface ContentWithLoading extends PropsWithChildren {
    isLoading: boolean;
}

const styles = {
    wrapper: 'relative',
    indicator: 'absolute inset-0',
    child: 'invisible',
};

export const ContentWithLoading: FC<ContentWithLoading> = ({
    isLoading,
    children,
}) => {
    return (
        <div className={styles.wrapper}>
            <If condition={isLoading}>
                <LoadingIndicator className={styles.indicator}/>
            </If>

            <div className={twClassNames({
                [styles.child]: isLoading,
            })}>
                {children}
            </div>
        </div>
    );
};