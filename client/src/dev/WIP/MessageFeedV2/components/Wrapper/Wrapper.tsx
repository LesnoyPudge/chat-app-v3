import { Scrollable } from "@components";
import { PropsWithChildrenAndClassName } from "@types";
import { FC } from "react";
import { ScrollableV2 } from "src/dev/WIP/ScrollableV2";



export const Wrapper: FC<PropsWithChildrenAndClassName> = ({
    className = '',
    children,
}) => {
    return (
        <ScrollableV2
            className={className}
            // setScrollable={setContentElement}
            // setScrollableWrapper={setContentWrapperElement}
            direction='vertical'
            // followContentSize
            // label='Сообщения'
        >
            <div
                role='feed'
                aria-busy
                aria-label='Лента сообщений'
            >
                {children}
            </div>
        </ScrollableV2>
    )
}