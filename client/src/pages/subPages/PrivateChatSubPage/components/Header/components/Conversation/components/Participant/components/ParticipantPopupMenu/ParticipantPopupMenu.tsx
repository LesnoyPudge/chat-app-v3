import { CheckBoxIndicatorCheck, PopupMenu } from "@components";
import { AppSelectors, AppSlice } from "@redux/features";
import { useAppDispatch, useMemoSelectorV2 } from "@redux/hooks";
import { FC } from "react";
import { useToggle } from "usehooks-ts";



type ParticipantPopupMenu = (
    Pick<
        Parameters<typeof PopupMenu.Wrapper>[0], 
        'label' | 'leaderElementOrRectRef'
    >
    & {
        userId: string;
    }
)

export const ParticipantPopupMenu: FC<ParticipantPopupMenu> = ({
    userId,
    label,
    leaderElementOrRectRef,
}) => {
    const { id } = useMemoSelectorV2(AppSelectors.selectMe);
    const {dispatch} = useAppDispatch()
    const [isParticipantMuted, toggle] = useToggle(false);
    const {
        deaf,
        muted,
    } = useMemoSelectorV2(AppSelectors.selectAppState)
    
    const isMe = id === userId;
    const notMe = !isMe;

    const muteParticipant = () => {
        console.log('mute', userId)
        toggle()
    }

    const toggleDeaf = () => dispatch(AppSlice.actions.toggleDeaf());
    const toggleMute = () => dispatch(AppSlice.actions.toggleMute());

    return (
        <PopupMenu.Wrapper
            leaderElementOrRectRef={leaderElementOrRectRef}
            label={label}
        >
            {({closeOverlay}) => (
                <>
                    <If condition={isMe}>
                        <PopupMenu.Item onClick={toggleMute}>
                            <>Откл. микрофон</>

                            <CheckBoxIndicatorCheck checked={muted}/>
                        </PopupMenu.Item>

                        <PopupMenu.Item onClick={toggleDeaf}>
                            <>Откл. звук</>

                            <CheckBoxIndicatorCheck checked={deaf}/>
                        </PopupMenu.Item>
                    </If>
                    
                    <If condition={notMe}>
                        <PopupMenu.Item onClick={muteParticipant}>
                            <>Заглушить</>

                            <CheckBoxIndicatorCheck 
                                checked={isParticipantMuted}
                            />
                        </PopupMenu.Item>
                    </If>

                    <PopupMenu.Item onClick={closeOverlay}>
                        <>Закрыть</>
                    </PopupMenu.Item>
                </>
            )}
        </PopupMenu.Wrapper>
    )
}