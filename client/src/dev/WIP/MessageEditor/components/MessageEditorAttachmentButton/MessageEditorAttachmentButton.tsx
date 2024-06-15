import { FileInput, SpriteImage } from "@components";
import { FC, useContext } from "react";
import { AttachmentUploadContext } from "../MessageEditorAttachmentUploadProvider";
import { sharedStyles } from "../../MessageEditor.styles";
import { cn } from "@utils";



export const MessageEditorAttachmentButton: FC = () => {
    const {fileInputProps} = useContext(AttachmentUploadContext)

    return (
        <>
            <FileInput
                className={cn(
                    sharedStyles.stickyControl, 
                    sharedStyles.buttonWithIcon
                )}
                {...fileInputProps}
            >
                <SpriteImage
                    className={sharedStyles.buttonIcon}
                    name='ADD_FILE_ICON'
                />
            </FileInput>
        </>
    )
}