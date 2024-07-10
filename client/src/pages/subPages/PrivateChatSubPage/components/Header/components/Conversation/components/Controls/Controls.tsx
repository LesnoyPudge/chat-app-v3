import { Button, Ref, SpriteImage, Tooltip } from "@components";
import { IMAGES } from "@generated";
import { useContextProxy } from "@lesnoypudge/utils-react";
import { AppSelectors, AppSlice } from "@redux/features";
import { useAppDispatch, useMemoSelectorV2 } from "@redux/hooks";
import { TMPConversationContext } from "@subPages/PrivateChatSubPage/components/Header/Header";
import { cn } from "@utils";
import { FC } from "react";
import { ScrollableV2 } from "src/dev/WIP/ScrollableV2";



const styles = {
    wrapper: 'flex gap-4',
    button: 'size-14 rounded-full shrink-0 duration-75',
    icon: 'size-6 m-auto',
    muteAndDeaf: {
        button: `bg-white-black`,
        icon: 'fill-black-white',
    },
    hangup: {
        button: `bg-danger hover:bg-danger-hover 
        focus-visible:bg-danger-hover`,
        icon: 'fill-white',
    },
}

export const Controls: FC = () => {
    const {
        deaf,
        muted,
    } = useMemoSelectorV2(AppSelectors.selectAppState);
    const { endConversation } = useContextProxy(TMPConversationContext);
    const {dispatch} = useAppDispatch();

    const toggleMute = () => dispatch(AppSlice.actions.toggleMute());
    const toggleDeaf = () => dispatch(AppSlice.actions.toggleDeaf());

    const muteIcon = (
        muted
            ? IMAGES.SPRITE.MICROPHONE_MUTED.NAME
            : IMAGES.SPRITE.MICROPHONE.NAME
    );
    
    const deafIcon = (
        deaf
            ? IMAGES.SPRITE.HEADPHONE_MUTED.NAME
            : IMAGES.SPRITE.HEADPHONE.NAME
    );

    return (
        <ScrollableV2 
            className={styles.wrapper}
            direction="horizontal" 
            size="hidden"
        >
            <Ref<HTMLButtonElement>>
                {(ref) => (
                    <>
                        <Button
                            className={cn(styles.button, styles.muteAndDeaf.button)}
                            label="Откл. микрофон"
                            innerRef={ref}
                            onLeftClick={toggleMute}
                        >
                            <SpriteImage 
                                className={cn(styles.icon, styles.muteAndDeaf.icon)}
                                name={muteIcon}
                            />
                        </Button>

                        <Tooltip 
                            leaderElementRef={ref}
                            preferredAlignment="top"
                        >
                            <>Откл. микрофон</>
                        </Tooltip>
                    </>
                )}
            </Ref>

            <Ref<HTMLButtonElement>>
                {(ref) => (
                    <>
                        <Button
                            className={cn(styles.button, styles.muteAndDeaf.button)}
                            label='Откл. звук'
                            innerRef={ref}
                            onLeftClick={toggleDeaf}
                        >
                            <SpriteImage 
                                className={cn(styles.icon, styles.muteAndDeaf.icon)}
                                name={deafIcon}
                            />
                        </Button>

                        <Tooltip 
                            leaderElementRef={ref}
                            preferredAlignment="top"
                        >
                            <>Откл. звук</>
                        </Tooltip>
                    </>
                )}
            </Ref>
            
            <Ref<HTMLButtonElement>>
                {(ref) => (
                    <>
                        <Button
                            className={cn(styles.button, styles.hangup.button)}
                            label="Покинуть разговор"
                            innerRef={ref}
                            onLeftClick={endConversation}
                        >
                            <SpriteImage
                                className={cn(styles.icon, styles.hangup.icon)}
                                name={IMAGES.SPRITE.HANGUP.NAME}
                            />
                        </Button>

                        <Tooltip 
                            leaderElementRef={ref}
                            preferredAlignment="top"
                        >
                            <>Покинуть разговор</>
                        </Tooltip>
                    </>
                )}
            </Ref>
        </ScrollableV2>
    )
}