import classNames from 'classnames';
import React, { FC, PropsWithChildren } from 'react';
// import styles from './Button.module.scss';
import './Button.scss';



export interface IButtonProps extends PropsWithChildren {
    onClick?: (args?: never) => void;
    onLeftClick?: (args?: never) => void;
    onMiddleClick?: (args?: never) => void;
    onRightClick?: (args?: never) => void;
    onHoverStart?: (args?: never) => void;
    onHoverEnd?: (args?: never) => void;
    // variant?: 'default' | 'wide';
    // theme?: 'none' | 'default' | 'brand' | 'link' | 'lite';
    variant?: 'brand' | 'link' | 'lite';
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    isLoading?: boolean;
    isActive?: boolean;
    isDisabled?: boolean;
    // nativeAttributes?: React.ButtonHTMLAttributes<HTMLButtonElement>;
}

export const Button: FC<IButtonProps> = ({
    children,
    onClick,
    onLeftClick,
    onMiddleClick,
    onRightClick,
    onHoverStart,
    onHoverEnd,
    variant,
    className = '',
    type = 'button',
    isLoading = false,
    isActive = false,
    isDisabled = false,
}) => {
    // const cx = classNames.bind(styles);
    const buttonCN = classNames({
        'button': true,
        // variant_brand: variant === 'brand',
        // variant_link: variant === 'link',
        // variant_lite: variant === 'lite',
        [`variant_${variant}`]: !!variant,
        [className]: className,
    });

    function handleLeftClick(e: React.MouseEvent) {
        if (e.button !== 0) return;
        if (!onClick && !onLeftClick) return;
        if (isDisabled || isLoading) return;

        onLeftClick && onLeftClick();
        (!onLeftClick && onClick) && onClick();
    }

    function handleMiddleClick(e: React.MouseEvent) {
        if (e.button !== 1) return;
        if (!onClick && !onMiddleClick) return;
        if (isDisabled || isLoading) return;
        e.stopPropagation();
        e.preventDefault();

        onMiddleClick && onMiddleClick();
        (!onMiddleClick && onClick) && onClick();
    }

    function handleRightClick(e: React.MouseEvent) {
        if (e.button !== 2) return;
        if (!onClick && !onRightClick) return;
        if (isDisabled || isLoading) return;
        e.stopPropagation();
        e.preventDefault();

        onRightClick && onRightClick();
        (!onRightClick && onClick) && onClick();
    }

    function handleTouchStart(e: React.TouchEvent) {
        // e.stopPropagation();
        // e.preventDefault();
        onHoverStart && onHoverStart();
    }

    function handleTouchEnd(e: React.TouchEvent) {
        // e.stopPropagation();
        // e.preventDefault();
        onHoverEnd && onHoverEnd();
    }

    return (
        <button
            className={buttonCN}
            type={type}
            disabled={isDisabled || isLoading}
            data-loading={isLoading}
            data-active={isActive}
            onClick={handleLeftClick}
            onAuxClick={handleMiddleClick}
            onContextMenu={handleRightClick}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            // {...nativeAttributes}
        >
            {children}
        </button>
    );
};