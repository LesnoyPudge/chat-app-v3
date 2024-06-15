import { PropsWithChildrenAndClassName } from "@types";
import { cn } from "@utils";
import { FC } from "react";
import { sharedStyles } from "../../MessageEditor.styles";



const styles = {
    inner: 'has-[[role=textbox]:focus-visible]:focused',
}

export const MessageEditorWrapper: FC<PropsWithChildrenAndClassName> = ({
    className = '',
    children
}) => {
    return (
        <div className={cn(sharedStyles.wrapper, className)}>
            <div className={cn(sharedStyles.inner, styles.inner)}>
                {children}
            </div>
        </div>
    )
}