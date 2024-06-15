import { Scrollable } from "@components";
import { PropsWithChildrenAndClassName } from "@types";
import { cn } from "@utils";
import { FC } from "react";



const styles = {
    sizeLimit: 'max-h-[50dvh]',
}

export const MessageEditorScroll: FC<PropsWithChildrenAndClassName> = ({
    className = '',
    children
}) => {
    return (
        <Scrollable
            className={cn(styles.sizeLimit, className)}
            followContentSize
            small
            withOppositeGutter
            autoHide
        >
            {children}
        </Scrollable>
    )
}