import { ViewportList, ViewportListPropsBase, ViewportListPropsWithItems } from 'react-viewport-list';
// import { ViewportList, ViewportListPropsBase, ViewportListPropsWithItems } from './tmp';



interface VirtualListProps<T> extends ViewportListPropsWithItems<T> {
    disableBottomFlickering?: boolean;
    disableTopFlickering?: boolean;
}

export const VirtualList = <T,>({
    disableBottomFlickering,
    disableTopFlickering,
    ...props
}: VirtualListProps<T>) => {
    return (
        <ViewportList 
            {...props}
            renderSpacer={({ ref, style, type }) => {
                // const noFlickerStyles = {
                //     bottom: {
                //         height: disableBottomFlickering ? 0 : style.height,
                //         minHeight: disableBottomFlickering ? 0 : style.height,
                //         maxHeight: disableBottomFlickering ? 0 : style.height,
                //     },
                //     top: {
                //         height: disableTopFlickering ? 0 : style.height,
                //         minHeight: disableTopFlickering ? 0 : style.height,
                //         maxHeight: disableTopFlickering ? 0 : style.height,
                //     },
                // };

                return (
                    <div ref={ref} style={{
                        ...style,
                        // ...noFlickerStyles[type],
                    }} />
                );
            }}
        >
            {props.children}
        </ViewportList>
    );
};