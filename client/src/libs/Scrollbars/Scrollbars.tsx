import { AutoSizerContext } from '@libs';
import { FC, PropsWithChildren, useContext } from 'react';
import ReactCustomScrollbars, { ScrollbarProps as ReactCustomScrollbarsProps } from 'react-custom-scrollbars-2';
import { twMerge } from 'tailwind-merge';
import { SizeType } from '@oyyds/react-auto-sizer';
import { Thumb } from './components';



type ScrollbarsOwnPropsType = PropsWithChildren & {
    className?: string;
    disableHorizontalScroll?: boolean;
    disableVerticalScroll?: boolean;
    getRef?: (scrollbarsRef: ReactCustomScrollbars | null) => void;
    onScroll?: (e: React.UIEvent<any, UIEvent>) => void;
    rest?: Omit<ReactCustomScrollbarsProps, keyof ScrollbarsOwnPropsType>;
}

type ScrollbarsType = ScrollbarsOwnPropsType & (
    {
        size: SizeType;
        autoSized?: never;  
    } | {
        size?: never;
        autoSized: true;
    }
)

type RenderElementPropsType = {style: React.CSSProperties}
type RenderElementType = (props: RenderElementPropsType) => JSX.Element;

export type ScrollbarsRefType = ReactCustomScrollbars;

export const Scrollbars: FC<ScrollbarsType> = ({
    className = '',
    size,
    autoSized,
    disableHorizontalScroll = false,
    disableVerticalScroll = false,
    getRef,
    onScroll,
    children,
    rest,
}) => {
    const autoSize = useContext(AutoSizerContext);
    const style = autoSized ? autoSize : size;

    const renderThumb: RenderElementType = ({ style }) => {
        const baseStyle: React.CSSProperties = {
            cursor: 'pointer',
            borderRadius: 'inherit',
            backgroundColor: 'red',
        };
        return <div className='' style={{ ...baseStyle, ...style }}></div>;
    };

    const renderTrack: RenderElementType = ({ style }) => {
        const baseStyle: React.CSSProperties = {
            right: '2px',
            bottom: '2px',
            top: '2px',
            borderRadius: '3px',
            backgroundColor: 'green',
        };

        return <div className='' style={{ ...baseStyle, ...style }}></div>;
    };

    return (
        <ReactCustomScrollbars
            {...rest}
            className={twMerge(className)}
            ref={getRef}
            style={style}
            universal
            onScroll={onScroll}
            // renderThumbVertical={(props) => <div {...props}></div>}
            // renderThumbHorizontal={renderThumb}
            renderThumbVertical={renderThumb}
            // renderTrackHorizontal={renderTrack}
            renderTrackVertical={renderTrack}
            renderView={({ style }) => <div style={{ ...style }}></div>}
        >
            {children}
        </ReactCustomScrollbars>
    );
};