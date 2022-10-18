import classNames from 'classnames';
import React, { FC, PropsWithChildren, useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';



export interface IButtonProps extends PropsWithChildren {
    className?: string;
    activeClassName?: string;
    isDefaultStyled?: boolean;
    variant?: 'brand' | 'link' | 'lite';
    type?: 'button' | 'submit' | 'reset';
    isLoading?: boolean;
    isActive?: boolean;
    isDisabled?: boolean;
    onClick?: (args?: never) => void;
    onLeftClick?: (args?: never) => void;
    onMiddleClick?: (args?: never) => void;
    onRightClick?: (args?: never) => void;
    onMouseEnter?: (args?: never) => void;
    onMouseLeave?: (args?: never) => void;
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
    isDefaultStyled = true,
    variant,
    type = 'button',
    isLoading = false,
    isActive = false,
    isDisabled = false,
    onClick,
    onLeftClick,
    onMiddleClick,
    onRightClick,
    onMouseEnter,
    onMouseLeave,
}) => {
    const ref = useRef<HTMLButtonElement | null>(null);
    const buttonCN = twMerge(classNames({
        [buttonClasses.base]: isDefaultStyled,
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
            
            onLeftClick && onLeftClick();
            (!onLeftClick && onClick) && onClick();
        };
    
        const handleMiddleClick = (e: MouseEvent) => {
            if (e.button !== 1) return;
            if (!onClick && !onMiddleClick) return;
            if (isDisabled || isLoading) return;
            e.stopPropagation();
            e.preventDefault();
    
            onMiddleClick && onMiddleClick();
            (!onMiddleClick && onClick) && onClick();
        };
    
        const handleRightClick = (e: MouseEvent) => {
            // if (e.button !== 2) return;
            if (!onClick && !onRightClick) return;
            if (isDisabled || isLoading) return;
            e.stopPropagation();
            e.preventDefault();
    
            onRightClick && onRightClick();
            (!onRightClick && onClick) && onClick();
        };
    
        const handleEnter = (e: KeyboardEvent) => {
            if (e.code !== 'Enter') return;
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
            onMouseEnter && onMouseEnter();
        };
    
        const handleMouseLeave = (e: MouseEvent) => {
            // e.stopPropagation();
            // e.preventDefault();
            onMouseLeave && onMouseLeave();
        };

        button.addEventListener('click', handleLeftClick);
        button.addEventListener('auxclick', handleMiddleClick);
        button.addEventListener('contextmenu', handleRightClick);
        button.addEventListener('keydown', handleEnter);
        button.addEventListener('mouseenter', handleMouseEnter);
        button.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            button.removeEventListener('click', handleLeftClick);
            button.removeEventListener('auxclick', handleMiddleClick);
            button.removeEventListener('contextmenu', handleRightClick);
            button.removeEventListener('keydown', handleEnter);
            button.removeEventListener('mouseenter', handleMouseEnter);
            button.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [isDisabled, isLoading, onClick, onMouseLeave, onMouseEnter, onLeftClick, onMiddleClick, onRightClick]);

    return (
        <button
            className={buttonCN}
            type={type}
            disabled={isDisabled || isLoading}
            ref={ref}
        >
            {children}
        </button>
    );
};