import { PropsWithChildrenAndClassName } from "@types";
import { cn } from "@utils";
import { FC } from "react";



type MessageEditorWrapper = PropsWithChildrenAndClassName & {
    focused?: boolean;
}

const styles = {
    wrapper: 'px-4 pt-4 pb-6',
    inner: 'rounded-lg bg-primary-100',
}

export const MessageEditorWrapper: FC<MessageEditorWrapper> = ({
    className = '',
    focused = false,
    children
}) => {
    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={cn(styles.inner, {
                ['focused']: focused,
            })}>
                {children}
            </div>
        </div>
    )
}