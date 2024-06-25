import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';



const styles = {
    wrapper: `flex flex-col justify-between w-[min(440px,100vw)] 
    shadow-elevation-high bg-primary-200 rounded`,
};

export const ModalContainer: FC<PropsWithChildrenAndClassName> = ({
    className = '',
    children,
}) => {
    return (
        <div className={twClassNames(styles.wrapper, className)}>
            {children}
        </div>
    );
};