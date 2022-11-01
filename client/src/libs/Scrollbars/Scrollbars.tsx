import classNames from 'classnames';
import { FC } from 'react';
import ReactCustomScrollbars, { ScrollbarProps as ReactCustomScrollbarsProps } from 'react-custom-scrollbars-2';



interface ISize {
    width: number;
    height: number;
}

interface IScrollbars {
    size: ISize;
    disableHorizontalScroll?: boolean;
    disableVerticalScroll?: boolean;
    ref: (scrollbarsRef: ReactCustomScrollbars | null) => void;
    rest: Omit<ReactCustomScrollbarsProps, keyof IScrollbars>;
}

export const Scrollbars: FC<IScrollbars> = ({
    size,
    disableHorizontalScroll = false,
    disableVerticalScroll = false,
    ref,
    rest,
}) => {
    return (
        <ReactCustomScrollbars
            {...rest}
            className={classNames({
                'amazing': disableHorizontalScroll, 
                'wow': disableVerticalScroll,
                [rest.className || '']: !!rest.className,
            })}
            ref={ref}
            style={{ ...size, ...rest.style }}
            // renderThumbHorizontal={() => <></>}
            // renderThumbVertical={() => <></>}
            // renderTrackHorizontal={() => <></>}
            // renderTrackVertical={() => <></>}
            renderView={() => <></>}
        >
            {rest.children}
        </ReactCustomScrollbars>
    );
};