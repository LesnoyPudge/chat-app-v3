import { PropsWithChildrenAndClassName } from '@types';
import { conditional, twClassNames } from '@utils';
import React, { FC } from 'react';



interface Button extends PropsWithChildrenAndClassName {
    stylingPreset?: 'brand' | 'link' | 'lite' | 'brandNeutral' | 'brandDanger' | 'brandPositive',
    size?: 'small' | 'medium' | 'big';
    type?: 'button' | 'submit' | 'reset';
    isActive?: boolean;
    isDisabled?: boolean;
    isLoading?: boolean;
    tabIndex?: number;
    label?: string;
    controls?: string;
    hasPopup?: 'dialog' | 'menu';
    role?: 'button' | 'menuitem' | 'tab' | 'presentation';
    hidden?: boolean;
    onAnyClick?: (e?: React.MouseEvent | React.KeyboardEvent) => void;
    onLeftClick?: (e?: React.MouseEvent | React.KeyboardEvent) => void;
    onMiddleClick?: (e?: React.MouseEvent) => void;
    onRightClick?: (e?: React.MouseEvent) => void;
    onMouseEnter?: (e?: React.MouseEvent) => void;
    onFocus?: (e?: React.FocusEvent) => void;
}

const styles = {
    base: `flex shrink-0 items-center justify-center w-fit 
    text-sm text-center rounded-[3px] underline-offset-4 decoration-2 
    decoration-current py-1 px-3 transition-all duration-100`,

    brand: {
        base: `text-white font-medium bg-brand 
        hover:bg-brand-hover focus-visible:bg-brand-hover 
        focus-within:bg-brand-hover active:bg-brand-active`,
        active: 'bg-brand-active',
    },

    brandNeutral: {
        base: `text-white font-medium bg-neutral 
        hover:bg-neutral-hover focus-visible:bg-neutral-hover 
        focus-within:bg-neutral-hover active:bg-neutral-active`,
        active: 'bg-neutral-active',
    },

    brandDanger: {
        base: `text-white font-medium bg-danger
        hover:bg-danger-hover focus-visible:bg-danger-hover 
        focus-within:bg-danger-hover active:bg-danger-active`,
        active: 'bg-danger-active',
    },

    brandPositive: {
        base: `text-white font-medium bg-positive 
        hover:bg-positive-hover focus-visible:bg-positive-hover 
        focus-within:bg-positive-hover active:bg-positive-active`,
        active: 'bg-positive-active',
    },

    link: {
        base: `p-0 text-color-link hover:underline focus-visible:underline
        focus-within:underline`,
        active: 'underline',
    },

    lite: {
        base: `text-color-primary hover:underline focus-visible:underline
        focus-within:underline`,
        active: 'underline',
    },
};

const sizes = {
    small: 'min-w-[60px] min-h-[32px]',
    medium: 'min-w-[96px] min-h-[38px]',
    big: 'min-w-[130px] min-h-[44px]',
};

export const Button: FC<Button> = ({
    className = '',
    size,
    stylingPreset,
    type = 'button',
    isActive = false,
    isDisabled = false,
    isLoading = false,
    tabIndex = 0,
    label,
    controls,
    hasPopup,
    role = 'button',
    hidden = false,
    onAnyClick,
    onLeftClick,
    onMiddleClick,
    onRightClick,
    onMouseEnter,
    onFocus,
    children,
}) => {
    if (!size && !!stylingPreset) size = 'small';

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

    const handleMiddleClick = (e: React.MouseEvent) => {
        if (!onAnyClick && !onMiddleClick) return;
        if (e.button !== 1) return;

        e.preventDefault();

        if (onMiddleClick) return onMiddleClick(e);
        if (onAnyClick) return onAnyClick(e);
    };

    const middleClickFix = (e: React.MouseEvent) => {
        if (!onAnyClick && !onMiddleClick) return;
        if (e.button !== 1) return;

        e.preventDefault();
    };

    const withExpanded = !!hasPopup;
    const withPressed = role === 'button';
    const withSelected = role === 'tab';

    const isExpanded = conditional(isActive, undefined, withExpanded);
    const isPressed = conditional(isActive, undefined, withPressed);
    const isSelected = conditional(isActive, undefined, withSelected);

    const validTabIndex = conditional(-1, tabIndex, hidden);

    return (
        <button
            className={twClassNames({
                [styles.base]: !!stylingPreset,
                [stylingPreset ? styles[stylingPreset].base : '']: !!stylingPreset,
                [stylingPreset ? styles[stylingPreset].active : '']: !!stylingPreset && isActive,
                [size ? sizes[size] : '']: !!size,
                [className]: !!className,
            })}
            type={type}
            data-active={isActive}
            data-disabled={isDisabled}
            data-loading={isLoading}
            disabled={isDisabled}
            tabIndex={validTabIndex}
            aria-label={label}
            aria-pressed={isPressed}
            aria-expanded={isExpanded}
            aria-selected={isSelected}
            aria-haspopup={hasPopup}
            aria-controls={controls}
            aria-hidden={hidden}
            role={role}
            onKeyDown={handleLeftClickWithKeyboard}
            onClick={handleLeftClick}
            onContextMenu={handleRightClick}
            onAuxClick={handleMiddleClick}
            onFocus={onFocus}
            onMouseEnter={onMouseEnter}
            onMouseDown={middleClickFix}
        >
            {children}
        </button>
    );
};