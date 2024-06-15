import { Placeholder } from "@components";
import { PropsWithClassName } from "@types";
import { cn } from "@utils";
import { FC } from "react";
import { sharedStyles } from "../../MessageEditor.styles";



export const MessageEditorPlaceholder: FC<PropsWithClassName> = ({
    className = '',
}) => {
    return (
        <div className={cn(sharedStyles.wrapper, className)}>
            <Placeholder
                className={sharedStyles.inner}
                title="Загрузка редактора"
            /> 
        </div>
    )
}