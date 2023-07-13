import { Conditional } from '@components';
import { PropsWithClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';



interface FormError extends PropsWithClassName {
    error: any;
}

const styles = {
    wrapper: 'bg-danger text-white font-semibold p-2 rounded-md',
};

export const FormError: FC<FormError> = ({
    className = '',
    error,
}) => {
    return (
        <Conditional isRendered={!!error}>
            <div className={twClassNames(styles.wrapper, className)}>
                {error?.error}
            </div>
        </Conditional>
    );
};