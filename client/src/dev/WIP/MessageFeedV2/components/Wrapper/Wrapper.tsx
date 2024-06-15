import { Scrollable } from "@components";
import { PropsWithChildrenAndClassName } from "@types";
import { FC } from "react";



export const Wrapper: FC<PropsWithChildrenAndClassName> = ({
    className = '',
    children,
}) => {
    return (
        <Scrollable
            className={className}
            // setScrollable={setContentElement}
            // setScrollableWrapper={setContentWrapperElement}
            direction='vertical'
            followContentSize
            label='Сообщения'
        >
            <div
                role='feed'
                aria-busy
                aria-label='Лента сообщений'
            >
                {children}
            </div>
        </Scrollable>
    )
}