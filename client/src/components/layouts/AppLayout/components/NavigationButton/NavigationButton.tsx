import { Button } from '@components';
import classNames from 'classnames';
import { PropsWithChildren, FC } from 'react';
import { twMerge } from 'tailwind-merge';



interface INavigationButton extends PropsWithChildren {
    className?: string;
    isActive?: boolean;
    theme: 'brand' | 'action';
    onLeftClick?: () => void;
}

const themes = {
    brand: {
        base: 'group-hover:bg-secondary-100 group-focus-within:bg-secondary-100',
        active: 'bg-secondary-100',
    },
    action: {
        base: 'group-hover:bg-green group-focus-within:bg-green',
        active: 'bg-green',
    },
};

export const NavigationButton: FC<INavigationButton> = ({ 
    children, 
    className = '',
    isActive = false,
    theme,
    onLeftClick,
}) => {
    return (
        <div className={twMerge(`flex w-full justify-center relative group ${className}`)}>
            <div 
                className={twMerge(classNames(
                    'opacity-0  transition-all w-2 h-0 group-hover:opacity-100 group-focus-within:opacity-100 bg-light absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 rounded-r-[4px]',
                    {
                        'opacity-100 h-8': isActive,
                        'group-hover:h-4 group-focus-within:h-4': !isActive,
                    },
                ))}
            ></div>

            <Button
                onLeftClick={onLeftClick}
                isDefaultStyled={false}
                className={twMerge(classNames(
                    'w-12 h-12 flex justify-center items-center bg-primary-300 rounded-full overflow-hidden transition-all group-hover:rounded-2xl group-focus-within:rounded-2xl',
                    {
                        'rounded-2xl': isActive,
                        [themes[theme].base]: true,
                        [themes[theme].active]: isActive,
                    },
                ))}
            >
                {children}
            </Button>
        </div>
    );
};