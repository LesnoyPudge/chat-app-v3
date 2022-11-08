import classNames from 'classnames';
import { FC, PropsWithChildren, useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';



export interface IButtonProps extends PropsWithChildren {
    className?: string;
    activeClassName?: string;
    isntStyled?: boolean;
    variant?: 'brand' | 'link' | 'lite';
    type?: 'button' | 'submit' | 'reset';
    isLoading?: boolean;
    isActive?: boolean;
    isDisabled?: boolean;
    tabIndex?: number;
    onClick?: (e?: MouseEvent) => void;
    onLeftClick?: (e?: MouseEvent) => void;
    onMiddleClick?: (e?: MouseEvent) => void;
    onRightClick?: (e?: MouseEvent) => void;
    onMouseEnter?: (e?: MouseEvent) => void;
    onMouseLeave?: (e?: MouseEvent) => void;
    onFocus?: (e?: FocusEvent) => void;
}

const buttonClasses = {
    base: 'text-center rounded underline-offset-4 decoration-1 decoration-current py-1 px-3 transition-all duration-100',
    brand: {
        base: 'text-white font-semibold bg-secondary-100 hover:bg-secondary-200 focus-visible:bg-secondary-200 active:bg-secondary-300',
        active: 'bg-secondary-300',
    },
    link: {
        base: 'p-0 text-link hover:underline focus-visible:underline',
        active: 'underline',
    },
    lite: {
        base: 'text-primary hover:underline hover:text-secondary focus-visible:underline focus-visible:text-secondary active:bg-secondary-300 active:text-secondary',
        active: 'bg-secondary-300 text-secondary',
    },
};

export const Button: FC<IButtonProps> = ({
    children,
    className = '',
    activeClassName = '',
    isntStyled = false,
    variant,
    type = 'button',
    isLoading = false,
    isActive = false,
    isDisabled = false,
    tabIndex = 0,
    onClick,
    onLeftClick,
    onMiddleClick,
    onRightClick,
    onMouseEnter,
    onMouseLeave,
    onFocus,
}) => {
    const ref = useRef<HTMLButtonElement | null>(null);
    const buttonCN = twMerge(classNames({
        [buttonClasses.base]: !isntStyled,
        [buttonClasses[variant || 'brand'].base]: !!variant,
        [buttonClasses[variant || 'brand'].active]: !!variant && isActive,
        [className]: !!className,
        [activeClassName]: !!activeClassName && isActive,
    }));

    useEffect(() => {
        if (!ref.current) return;
        const button = ref.current;

        const handleLeftClick = (e: MouseEvent) => {
            if (e.button !== 0) return;
            if (!onClick && !onLeftClick) return;
            if (isDisabled || isLoading) return;
            e.stopPropagation();
            e.preventDefault();
            
            onLeftClick && onLeftClick(e);
            (!onLeftClick && onClick) && onClick(e);
        };
    
        const handleMiddleClick = (e: MouseEvent) => {
            if (e.button !== 1) return;
            if (!onClick && !onMiddleClick) return;
            if (isDisabled || isLoading) return;
            e.stopPropagation();
            e.preventDefault();
    
            onMiddleClick && onMiddleClick(e);
            (!onMiddleClick && onClick) && onClick(e);
        };
    
        const handleRightClick = (e: MouseEvent) => {
            // if (e.button !== 2) return;
            if (!onClick && !onRightClick) return;
            if (isDisabled || isLoading) return;
            e.stopPropagation();
            e.preventDefault();
    
            onRightClick && onRightClick(e);
            (!onRightClick && onClick) && onClick(e);
        };
    
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code !== 'Enter' && e.code !== 'Space') return;
            if (!onClick && !onLeftClick) return;
            if (isDisabled || isLoading) return;
            e.stopPropagation();
            e.preventDefault();
            
            onLeftClick && onLeftClick();
            (!onLeftClick && onClick) && onClick();
        };

        const handleMouseEnter = (e: MouseEvent) => {
            // e.stopPropagation();
            // e.preventDefault();
            onMouseEnter && onMouseEnter(e);
        };
    
        const handleMouseLeave = (e: MouseEvent) => {
            // e.stopPropagation();
            // e.preventDefault();
            onMouseLeave && onMouseLeave(e);
        };

        const handleFocus = (e: FocusEvent) => {
            onFocus && onFocus(e);
        };

        button.addEventListener('click', handleLeftClick);
        button.addEventListener('auxclick', handleMiddleClick);
        button.addEventListener('contextmenu', handleRightClick);
        button.addEventListener('keydown', handleKeyDown);
        button.addEventListener('mouseenter', handleMouseEnter);
        button.addEventListener('mouseleave', handleMouseLeave);
        button.addEventListener('focusin', handleFocus);

        return () => {
            button.removeEventListener('click', handleLeftClick);
            button.removeEventListener('auxclick', handleMiddleClick);
            button.removeEventListener('contextmenu', handleRightClick);
            button.removeEventListener('keydown', handleKeyDown);
            button.removeEventListener('mouseenter', handleMouseEnter);
            button.removeEventListener('mouseleave', handleMouseLeave);
            button.removeEventListener('focusin', handleFocus);
        };
    }, [isDisabled, isLoading, onClick, onMouseLeave, onMouseEnter, 
        onLeftClick, onMiddleClick, onRightClick, onFocus],
    );

    return (
        <button
            className={buttonCN}
            type={type}
            disabled={isDisabled || isLoading}
            tabIndex={tabIndex}
            ref={ref}
            // onClick={onLeftClick}
            // onAuxClick={onMiddleClick}
            // onContextMenu={onRightClick}
            // onMouseEnter={onMouseEnter}
            // onMouseLeave={onMouseLeave}
            // onFocus={onFocus}
        >
            {children}
        </button>
    );
};