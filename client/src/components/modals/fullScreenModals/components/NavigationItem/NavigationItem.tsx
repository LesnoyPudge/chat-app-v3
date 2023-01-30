import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';



interface NavigationItem extends PropsWithChildrenAndClassName {
    isActive?: boolean;
}

const styles = {
    item: {
        base: `flex items-center justify-between w-full 
        py-1.5 px-2.5 text-color-secondary font-medium text-start fill-icon-200
        rounded-md hover:bg-primary-hover hover:text-color-primary hover:fill-icon-100
        group-focus-visible:bg-primary-hover group-focus-visible:fill-icon-100
        group-focus-visible:text-color-primary`,
        active: 'bg-primary-hover text-color-primary fill-icon-100',
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