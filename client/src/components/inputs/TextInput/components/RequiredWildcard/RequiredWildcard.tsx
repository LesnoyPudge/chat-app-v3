import { PropsWithClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';
import { Conditional } from '@components';



interface RequiredWildcard extends PropsWithClassName {
    hidden?: boolean;
}

const styles = {
    wildcard: 'text-required',
};

export const RequiredWildcard: FC<RequiredWildcard> = ({
    className = '',
    hidden = false,
}) => {
    return (
        <Conditional isRendered={!hidden}>
            <span className={twClassNames(styles.wildcard, className)}>
                <>*</>
            </span>
        </Conditional>
    );
};