import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';



interface NavigationItem extends PropsWithChildrenAndClassName {
    isActive?: boolean;
}

const styles = {
    item: {
        base: `w-full py-1.5 px-2.5 text-secondary font-medium text-start
        rounded-md hover:bg-hover hover:text-primary group-focus-visible:bg-hover 
        group-focus-visible:text-primary`,
        active: 'bg-hover text-primary',
    },
};

export const NavigationItem: FC<NavigationItem> = ({
    className = '',
    isActive = false,
    children,
}) => {
    return (
        <div className={twClassNames(
            styles.item.base, 
            { [styles.item.active]: isActive },
            className,
        )}>
            {children}
        </div>
    );
};