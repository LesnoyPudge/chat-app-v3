import { Button } from '@components';
import { twClassNames } from '@utils';
import { PropsWithChildren, FC } from 'react';



interface INavigationButton extends PropsWithChildren {
    className?: string;
    isActive?: boolean;
    theme: 'brand' | 'action';
    tabIndex?: number;
    onLeftClick?: () => void;
}

const themes = {
    brand: {
        base: 'group-hover:bg-brand group-focus-within:bg-brand',
        active: 'bg-brand rounded-2xl',
    },
    action: {
        base: 'group-hover:bg-green group-focus-within:bg-green',
        active: 'bg-green rounded-2xl',
    },
};

const styles = {
    section: 'flex w-full justify-center relative group',
    bulletWrapper: {
        base: `opacity-0 transition-all w-2 h-0 bg-light absolute top-1/2 
        left-0 -translate-y-1/2 -translate-x-1/2 rounded-r-[4px]`,
        hover: `group-hover:h-5 group-focus-within:h-5 group-hover:opacity-100 
        group-focus-within:opacity-100`,
        active: 'opacity-100 h-10',
    },
    button: `w-12 h-12 flex justify-center items-center bg-primary-300 
    rounded-full overflow-hidden transition-all ease-linear
    group-hover:rounded-2xl group-focus-within:rounded-2xl`,
};

export const NavigationButton: FC<INavigationButton> = ({ 
    children, 
    className = '',
    isActive = false,
    theme,
    tabIndex,
    onLeftClick,
}) => {
    return (
        <div className={twClassNames(styles.section, { className })}>
            <div 
                className={twClassNames(
                    styles.bulletWrapper.base, 
                    {
                        [styles.bulletWrapper.hover]: !isActive,
                        [styles.bulletWrapper.active]: isActive,
                    },
                )}
            ></div>

            <Button
                onLeftClick={onLeftClick}
                tabIndex={tabIndex}
                className={twClassNames(
                    styles.button, themes[theme].base,
                    { [themes[theme].active]: isActive },
                )}
            >
                {children}
            </Button>
        </div>
    );
};