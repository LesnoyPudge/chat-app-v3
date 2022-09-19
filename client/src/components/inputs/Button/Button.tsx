import classNames from 'classnames';
import React, { FC, PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';



export interface IButtonProps extends PropsWithChildren {
    className?: string;
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
    onHoverStart?: (args?: never) => void;
    onHoverEnd?: (args?: never) => void;
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
    onClick,
    onLeftClick,
    onMiddleClick,
    onRightClick,
    onHoverStart,
    onHoverEnd,
    children,
    isDefaultStyled = true,
    variant,
    className = '',
    type = 'button',
    isLoading = false,
    isActive = false,
    isDisabled = false,
}) => {
    const buttonCN = twMerge(classNames({
        [buttonClasses.base]: isDefaultStyled,
        [buttonClasses[variant || 'brand'].base]: !!variant,
        [buttonClasses[variant || 'brand'].active]: !!variant && isActive,
        [className]: !!className,
    }));

    const handleLeftClick = (e: React.MouseEvent) => {
        if (e.button !== 0) return;
        if (!onClick && !onLeftClick) return;
        if (isDisabled || isLoading) return;
        e.stopPropagation();
        e.preventDefault();
        
        onLeftClick && onLeftClick();
        (!onLeftClick && onClick) && onClick();
    };

    const handleMiddleClick = (e: React.MouseEvent) => {
        if (e.button !== 1) return;
        if (!onClick && !onMiddleClick) return;
        if (isDisabled || isLoading) return;
        e.stopPropagation();
        e.preventDefault();

        onMiddleClick && onMiddleClick();
        (!onMiddleClick && onClick) && onClick();
    };

    const handleRightClick = (e: React.MouseEvent) => {
        if (e.button !== 2) return;
        if (!onClick && !onRightClick) return;
        if (isDisabled || isLoading) return;
        e.stopPropagation();
        e.preventDefault();

        onRightClick && onRightClick();
        (!onRightClick && onClick) && onClick();
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        // e.stopPropagation();
        // e.preventDefault();
        onHoverStart && onHoverStart();
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        // e.stopPropagation();
        // e.preventDefault();
        onHoverEnd && onHoverEnd();
    };

    return (
        <button
            className={buttonCN}
            type={type}
            disabled={isDisabled || isLoading}
            onClick={handleLeftClick}
            onAuxClick={handleMiddleClick}
            onContextMenu={handleRightClick}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
        >
            {children}
        </button>
    );
};