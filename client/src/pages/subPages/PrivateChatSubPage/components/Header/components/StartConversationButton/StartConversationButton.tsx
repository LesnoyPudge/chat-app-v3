import { Button, SpriteImage, Tooltip } from "@components";
import { useContextProxy } from "@lesnoypudge/utils-react";
import { FC, useRef } from "react";
import { TMPConversationContext } from "../../Header";
import { IMAGES } from "@generated";
import { RT } from "@lesnoypudge/types-utils-react/namespace";
import { cn } from "@utils";



const styles = {
    button: `h-full aspect-square grid place-items-center 
    fill-icon-200 hover:fill-icon-100`,
    icon: 'size-6',
}

export const StartConversationButton: FC<RT.PropsWithClassName> = ({
    className = ''
}) => {
    const { startConversation } = useContextProxy(TMPConversationContext);
    const ref = useRef<HTMLButtonElement>(null)

    return (
        <>
            <Button
                className={cn(styles.button, className)}
                innerRef={ref}
                onLeftClick={startConversation}
            >
                <SpriteImage
                    className={styles.icon}
                    name={IMAGES.SPRITE.CALL.NAME}
                />
            </Button>

            <Tooltip
                preferredAlignment='bottom'
                leaderElementRef={ref}
            >
                <>Начать звонок</>
            </Tooltip>
        </>
    )
}