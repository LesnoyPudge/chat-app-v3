import { cn } from "@utils";
import { FC } from "react";
import { sharedStyles } from "../../MessageEditor.styles";
import { PropsWithChildrenAndClassName } from "@types";



const styles = {
    inner: 'cursor-not-allowed opacity-60 truncate grid place-content-center'
}

export const MessageEditorDisabled: FC<PropsWithChildrenAndClassName> = ({
    className = '',
    children,
}) => {
    return (
        <div className={cn(
            sharedStyles.wrapper,
            className,
        )}>
            <div className={cn(sharedStyles.inner, styles.inner)}>
                {children}
            </div>
        </div>
    )
}