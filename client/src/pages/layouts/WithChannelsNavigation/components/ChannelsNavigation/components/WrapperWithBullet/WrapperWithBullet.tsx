import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';



interface WrapperWithBullet extends PropsWithChildrenAndClassName {
    isActive?: boolean;
}

const styles = {
    buttonWrapper: 'relative',
    bullet: {
        base: `opacity-0 transition-all w-2 h-0 bg-light absolute top-1/2 
        left-0 -translate-y-1/2 -translate-x-1/2 rounded-r-[4px]`,
        hover: `peer-hover:h-5 peer-focus-visible:h-5 peer-hover:opacity-100 
        peer-focus-visible:opacity-100`,
        active: 'opacity-100 h-10',
    },
};

export const WrapperWithBullet: FC<WrapperWithBullet> = ({
    className = '',
    isActive = false,
    children,
}) => {
    return (
        <div className={twClassNames(styles.buttonWrapper, className)}>
            {children}
                
            <div 
                className={twClassNames(
                    styles.bullet.base, 
                    {
                        [styles.bullet.hover]: !isActive,
                        [styles.bullet.active]: isActive,
                    },
                )}
            ></div>
        </div>
    );
};