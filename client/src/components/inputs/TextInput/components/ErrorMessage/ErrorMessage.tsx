import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';
import { Conditional } from '@components';



interface ErrorMessage extends PropsWithChildrenAndClassName {
    hidden?: boolean;
    withoutSeparator?: boolean;
}

const styles = {
    error: 'text-xs w-full text-error normal-case',
};

export const ErrorMessage: FC<ErrorMessage> = ({
    className = '',
    hidden = false,
    withoutSeparator = false,
    children,
}) => {
    return (
        <Conditional isRendered={!!children && !hidden}>
            <span className={twClassNames(styles.error, className)}>
                <Conditional isRendered={!withoutSeparator}>
                    <> &#8722; </>
                </Conditional>

                {children}
            </span>
        </Conditional>
    );
};