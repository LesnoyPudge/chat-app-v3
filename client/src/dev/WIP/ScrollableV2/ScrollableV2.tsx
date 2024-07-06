import { FC, RefObject } from "react";
import css from "./ScrollableV2.module.scss";
import { cn } from "@utils";
import { RT } from "@lesnoypudge/types-utils-react/namespace";



type ScrollableV2 = (
    RT.PropsWithChildrenAndClassName
    & {
        ref?: RefObject<HTMLDivElement>;
        label?: string;
        direction?: 'horizontal' | 'vertical' | 'both';
        withOppositeGutter?: boolean;
        size?: 'default' | 'small' | 'hidden';
    }
);

const styles = {
    scrollable: 'max-h-full max-w-full'
}

export const ScrollableV2: FC<ScrollableV2> = ({
    className = '',
    ref,
    label = 'Scrollable region',
    direction = 'vertical',
    size = 'default',
    withOppositeGutter = false,
    children,
}) => {
    const data = {
        'data-with-opposite-gutter': withOppositeGutter,
        'data-size': size,
        'data-direction': direction,
    };

    return (
        <div 
            className={cn(css.scrollable, styles.scrollable, className)}
            role="region"
            aria-label={label}
            tabIndex={0}
            ref={ref}
            {...data}
        >
            {children}
        </div>
    )
}