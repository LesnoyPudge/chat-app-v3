import { FC, RefObject } from "react";
import css from "./ScrollableV2.module.scss";
import { cn } from "@utils";
import { RT } from "@lesnoypudge/types-utils-react/namespace";



type ScrollableV2 = (
    RT.PropsWithChildrenAndClassName
    & (
        {
            direction?: 'vertical' | 'both';
            withOppositeGutter?: true;
        } 
        | {
            direction?: 'horizontal';
            withOppositeGutter?: false;
        }
    )
    & {
        innerRef?: RefObject<HTMLDivElement>;
        label?: string;
        // direction?: 'horizontal' | 'vertical' | 'both';
        // withOppositeGutter?: boolean;
        size?: 'default' | 'small' | 'hidden';
    }
);

const styles = {
    scrollable: 'max-h-full max-w-full'
}

export const ScrollableV2: FC<ScrollableV2> = ({
    className = '',
    innerRef,
    label = 'Scrollable region',
    direction = 'vertical',
    size = 'default',
    withOppositeGutter = false,
    children,
}) => {
    const withGutter = direction !== 'horizontal';

    const data = {
        'data-with-opposite-gutter': withGutter && withOppositeGutter,
        'data-size': size,
        'data-direction': direction,
    };

    return (
        <div 
            className={cn(css.scrollable, styles.scrollable, className)}
            role="region"
            aria-label={label}
            tabIndex={0}
            ref={innerRef}
            {...data}
        >
            {children}
        </div>
    )
}