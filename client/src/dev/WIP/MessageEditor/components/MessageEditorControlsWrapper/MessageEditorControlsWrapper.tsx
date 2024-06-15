import { PropsWithChildrenAndClassName } from "@types";
import { cn } from "@utils";
import { FC } from "react";



const styles = {
    wrapper: 'flex'
}

export const MessageEditorControlsWrapper: FC<PropsWithChildrenAndClassName> = ({
    className = '',
    children,
}) => {

    return (
        <div className={cn(styles.wrapper, className)}>
            {children}
        </div>
    )
};