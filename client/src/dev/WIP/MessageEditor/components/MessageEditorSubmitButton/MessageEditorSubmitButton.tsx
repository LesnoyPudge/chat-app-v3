import { Button, SpriteImage } from "@components";
import { cn } from "@utils";
import { FC } from "react";
import { sharedStyles } from "../../MessageEditor.styles";
import { useFormikContext } from "formik";



export const MessageEditorSubmitButton: FC = () => {
    const {isSubmitting} = useFormikContext()

    return (
        <Button
            className={cn(sharedStyles.buttonWithIcon, sharedStyles.stickyControl)}
            type='submit'
            label='Отправить сообщение'
            isLoading={isSubmitting}
        >
            <SpriteImage
                className={sharedStyles.buttonIcon}
                name='SEND_MESSAGE_ICON'
            />
        </Button>
    )
}