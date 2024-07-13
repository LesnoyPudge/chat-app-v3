import { FC, RefObject } from "react";
import css from "./ScrollableV2.module.scss";
import { cn } from "@utils";
import { RT } from "@lesnoypudge/types-utils-react/namespace";



type ScrollableV2 = (
    RT.PropsWithChildrenAndClassName
    & (
        {
            direction?: 'vertical' | 'both';
            withOppositeGutter?: boolean;
        } 
        | {
            direction?: 'horizontal';
            withOppositeGutter?: false;
        }
    )
    & {
        withoutGutter?: boolean;
        innerRef?: RefObject<HTMLDivElement>;
        label?: string;
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
    withoutGutter = false,
    children,
}) => {
    const notHorizontal = direction !== 'horizontal';
    const withGutter = !withoutGutter;

    const data = {
        'data-with-opposite-gutter': (
            withGutter 
            && notHorizontal
            && withOppositeGutter
        ),
        'data-size': size,
        'data-direction': direction,
        'data-with-gutter': withGutter && notHorizontal,
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