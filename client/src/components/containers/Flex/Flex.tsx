import classNames from 'classnames/bind';
import React, { FC, PropsWithChildren, RefObject } from 'react';
import { JsxAttributes, JsxElement } from 'typescript';
import styles from './Flex.module.scss';



export interface IFlexProps extends PropsWithChildren {
    className?: string;
    // position?: 'relative' | 'absolute' | 'fixed' | 'sticky' | 'static';
    direction?: 'column' | 'row';
    gap?: number;
    align?: 'start' | 'center' | 'end';
    justify?: 'start' | 'center' | 'end' | 'space-between';
    grow?: 0 | 1;
    shrink?: 0 | 1;
    basis?: string;
    // margin?: string;
    // padding?: string;
    // width?: string;
    // height?: string;
    // top?: string;
    // left?: string;
    // minHeight?: string;
    // maxHeight?: string;
    // cursor?: 'default' | 'pointer';
    // overflowY?: 'visible' | 'hidden' | 'auto' | 'scroll';
    // overflowX?: 'visible' | 'hidden' | 'auto' | 'scroll';
    // isDisplayed?: boolean;
    // isVisible?: boolean;
    // ref?: RefObject<HTMLDivElement>;
    // nativeAttributes?: React.DOMAttributes<HTMLDivElement>;
}

export const Flex: FC<IFlexProps> = ({
    children, 
    className = '', 
    // position = '', 
    direction = '', 
    gap, 
    align = '', 
    justify = '', 
    grow, 
    shrink, 
    basis = '', 
    // margin = '', 
    // padding = '', 
    // width = '',
    // height = '', 
    // top = '', 
    // left = '', 
    // minHeight = '', 
    // maxHeight = '', 
    // cursor = '', 
    // overflowY = '', 
    // overflowX = '', 
    // isDisplayed = true, 
    // isVisible = true, 
    // nativeAttributes,
}) => {
    const cx = classNames.bind(styles);
    const flexCN = cx({ flex: true, [className]: !!className });
    const style = { 
        // '--position': position,
        '--gap': !!gap && `${gap}px`, 
        // '--margin': margin,
        // '--padding': padding, 
        '--direction': direction,
        '--align': align,
        '--justify': justify,
        '--grow': grow,
        '--shrink': shrink,
        '--basis': basis,
        // '--width': width,
        // '--height': height,
        // '--top': top,
        // '--left': left,
        // '--minHeight': minHeight,
        // '--maxHeight': maxHeight,
        // '--cursor': cursor,
        // '--overflowY': overflowY,
        // '--overflowX': overflowX,
        // 'display': isDisplayed ? '' : 'none', 
    } as React.CSSProperties; 

    return (
        <div 
            className={flexCN} 
            style={style}
            // ref={ref}
            // {...nativeAttributes}
        >
            {children}
        </div>
    );
};