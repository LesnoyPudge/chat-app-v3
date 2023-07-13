import { FC, PropsWithChildren } from 'react';
import { Conditional, LoadingIndicator } from '@components';
import { twClassNames } from '@utils';



interface ContentWithLoading extends PropsWithChildren {
    isLoading: boolean;
}

const styles = {
    wrapper: 'relative',
    indicator: 'absolute inset-0',
    child: 'opacity-0 invisible',
};

export const ContentWithLoading: FC<ContentWithLoading> = ({
    isLoading,
    children,
}) => {
    return (
        <div className={styles.wrapper}>
            <Conditional isRendered={isLoading}>
                <LoadingIndicator className={styles.indicator}/>
            </Conditional>

            <div className={twClassNames({
                [styles.child]: isLoading,
            })}>
                {children}
            </div>
        </div>
    );
};