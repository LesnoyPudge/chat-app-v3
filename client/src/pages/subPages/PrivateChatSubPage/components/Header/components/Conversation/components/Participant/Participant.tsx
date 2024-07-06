import { Button, OverlayContextProvider, UserAvatar } from "@components";
import { RT } from "@lesnoypudge/types-utils-react/namespace";
import { cn } from "@utils";
import { FC, useRef, useState } from "react";
import { useInterval } from "usehooks-ts";
import { ParticipantPopupMenu } from "./components";



type Participant = RT.PropsWithClassName & {
    userId: string;
}

const styles = {
    button: {
        base: 'rounded-full',
        speaking: 'outline-positive',
    },
    avatar: 'size-20',
}

export const Participant: FC<Participant> = ({
    className = '',
    userId,
}) => {
    const ref = useRef<HTMLButtonElement>(null)
    const [isSpeaking, setIsSpeaking] = useState(false);

    useInterval(() => {
        setIsSpeaking((prev) => !prev);
    }, 2000)

    const label = 'Настройки участника разговора';

    return (
        <OverlayContextProvider>
            {({openOverlay}) => (
                <>
                    <Button
                        className={cn(styles.button.base, {
                            [styles.button.speaking]: isSpeaking,
                        }, className)}
                        label="label"
                        hasPopup="menu"
                        innerRef={ref}
                        onAnyClick={openOverlay}
                    >
                        <UserAvatar
                            className={styles.avatar}
                            avatarId='https://i.pravatar.cc/200'
                            username='me'
                            hideStatus
                        />
                    </Button>

                    <ParticipantPopupMenu 
                        userId={userId}
                        leaderElementOrRectRef={ref} 
                        label={label}
                    />
                </>
            )}
        </OverlayContextProvider>
    )
}