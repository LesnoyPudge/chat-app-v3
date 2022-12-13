import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import React, { FC } from 'react';



interface Button extends PropsWithChildrenAndClassName {
    stylingPreset?: 'brand' | 'link' | 'lite' | 'neutral',
    type?: 'button' | 'submit' | 'reset';
    isActive?: boolean;
    isDisabled?: boolean;
    isLoading?: boolean;
    tabIndex?: number;
    label?: string;
    pressed?: boolean;
    expanded?: boolean;
    hasPopup?: 'dialog' | 'menu';
    onAnyClick?: (e?: React.MouseEvent | React.KeyboardEvent) => void;
    onLeftClick?: (e?: React.MouseEvent | React.KeyboardEvent) => void;
    // onMiddleClick?: (e?: React.MouseEvent) => void;
    onRightClick?: (e?: React.MouseEvent) => void;
    onMouseEnter?: (e?: React.MouseEvent) => void;
    onFocus?: (e?: React.FocusEvent) => void;
}

const styles = {
    base: `text-center rounded underline-offset-4 decoration-2 
    decoration-current py-1 px-3 transition-all duration-100`,
    brand: {
        base: `text-white font-semibold bg-secondary-100 
        hover:bg-secondary-200 focus-visible:bg-secondary-200 
        active:bg-secondary-300`,
        active: 'bg-secondary-300',
    },
    link: {
        base: 'p-0 text-link hover:underline focus-visible:underline',
        active: 'underline',
    },
    lite: {
        base: 'text-primary hover:underline focus-visible:underline',
        active: 'underline',
    },
    neutral: {
        base: '',
        active: '',
    },
};

export const Button: FC<Button> = ({
    className = '',
    stylingPreset,
    type = 'button',
    isActive = false,
    isDisabled = false,
    isLoading = false,
    tabIndex = 0,
    label,
    pressed,
    expanded,
    hasPopup,
    onAnyClick,
    onLeftClick,
    // onMiddleClick,
    onRightClick,
    onMouseEnter,
    onFocus,
    children,
}) => {
    const handleLeftClickWithKeyboard = (e: React.KeyboardEvent) => {
        if (e.code !== 'Enter' && e.code !== 'Space') return;

        handleLeftClick(e);
    };

    const handleLeftClick = (e: React.MouseEvent | React.KeyboardEvent) => {
        if (!onAnyClick && !onLeftClick) return;

        e.preventDefault();

        if (onLeftClick) return onLeftClick(e);
        if (onAnyClick) return onAnyClick(e);
    };

    const handleRightClick = (e: React.MouseEvent) => {
        if (!onAnyClick && !onRightClick) return;

        e.preventDefault();

        if (onRightClick) return onRightClick(e);
        if (onAnyClick) return onAnyClick(e);
    };

    // const handleMiddleClick = (e: React.MouseEvent) => {
    //     if (!onAnyClick && !onMiddleClick) return;
    //     if (e.button !== 1) return;

    //     e.preventDefault();

    //     if (onMiddleClick) return onMiddleClick(e);
    //     if (onAnyClick) return onAnyClick(e);
    // };

    // const middleClickFix = (e: React.MouseEvent) => {
    //     if (!onAnyClick && !onMiddleClick) return;
    //     if (e.button !== 1) return;

    //     e.preventDefault();
    // };

    return (
        <button
            className={twClassNames({
                [styles.base]: !!stylingPreset,
                [stylingPreset ? styles[stylingPreset].base : '']: !!stylingPreset,
                [stylingPreset ? styles[stylingPreset].active : '']: !!stylingPreset && isActive,
                [className]: !!className,
            })}
            type={type}
            data-active={isActive}
            data-disabled={isDisabled}
            data-loading={isLoading}
            disabled={isDisabled}
            tabIndex={tabIndex}
            aria-label={label}
            aria-pressed={pressed}
            aria-expanded={expanded}
            aria-haspopup={hasPopup}
            onKeyDown={handleLeftClickWithKeyboard}
            onClick={handleLeftClick}
            onContextMenu={handleRightClick}
            // onAuxClick={handleMiddleClick}
            onFocus={onFocus}
            onMouseEnter={onMouseEnter}
            // onMouseDown={middleClickFix}
        >
            {children}
        </button>
    );
};