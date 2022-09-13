import { Button } from '@components';
import { PropsWithChildren, FC } from 'react';



interface INavigationButton extends PropsWithChildren {
    className?: string;
    isActive?: boolean;
    theme: 'brand' | 'action';
    onLeftClick?: () => void;
}

export const NavigationButton: FC<INavigationButton> = ({ 
    children, 
    className = '',
    isActive = false,
    theme,
    onLeftClick,
}) => {
    const isBrand = theme === 'brand';

    return (
        <div className={`flex w-full justify-center relative group ${className}`}>
            <div 
                className={
                    `opacity-0  transition-all w-2 h-0
                    ${isActive ? 'opacity-100 h-8' : 'group-hover:h-4 group-hover:opacity-100 group-focus-within:h-4 group-focus-within:opacity-100'}
                    bg-light absolute 
                    top-1/2 left-0 -translate-y-1/2 -translate-x-1/2
                    rounded-r-[4px]`
                }
            ></div>

            <Button
                onLeftClick={onLeftClick}
                isDefaultStyled={false}
                className={
                    `w-12 h-12 flex justify-center items-center bg-primary-300
                    rounded-full overflow-hidden transition-all
                    group-hover:rounded-2xl group-focus-within:rounded-2xl
                    ${isActive && 'rounded-2xl'}
                    ${isBrand && 'group-hover:bg-secondary-100 group-focus-within:bg-secondary-100'}
                    ${isBrand && isActive && 'bg-secondary-100'}
                    ${!isBrand && 'group-hover:bg-green group-focus-within:bg-green'}
                    ${!isBrand && isActive && 'bg-green'}`
                }
            >
                {children}
            </Button>
        </div>
    );
};