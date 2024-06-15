import { RTEModules, uniqueEmojiCodeList, OverlayContextProvider, Button, Emoji, Popup, EmojiPicker } from "@components";
import { PropsWithClassName } from "@types";
import { getTransitionOptions, cn, noop } from "@utils";
import { FC, useRef } from "react";
import { useEmojiSwitcher } from "./hooks";
import { sharedStyles } from "../../MessageEditor.styles";



const styles = {
    button: 'group/button p-2',
    emoji: {
        base: `w-full h-full grayscale transition-all duration-300
        scale-[0.9] group-focus-visible/button:scale-[1] 
        group-focus-visible/button:grayscale-0
        group-hover/button:scale-[1] 
        group-hover/button:grayscale-0`,
        active: 'scale-[1] grayscale-0',
    },
};

export const MessageEditorEmojiPickerButton: FC<PropsWithClassName> = ({
    className = '',
}) => {
    const { insert } = RTEModules.Emoji.useInsertEmoji();
    
    const transitionOptions = getTransitionOptions.withOpacity();
    const buttonRef = useRef<HTMLButtonElement>(null);
    const {changeEmoji, emojiCode} = useEmojiSwitcher(uniqueEmojiCodeList);

    return (
        <OverlayContextProvider>
            {({ openOverlay, isOverlayExist }) => (
                <>
                    <Button
                        className={cn(
                            sharedStyles.stickyControl, 
                            styles.button,
                            className,
                        )}
                        label='Выбрать эмодзи'
                        hasPopup='dialog'
                        innerRef={buttonRef}
                        isActive={isOverlayExist}
                        onMouseEnter={isOverlayExist ? noop : changeEmoji}
                        onLeftClick={openOverlay}
                    >
                        <Emoji
                            className={cn(
                                styles.emoji.base, 
                                { [styles.emoji.active]: isOverlayExist },
                            )}
                            code={emojiCode}
                        />
                    </Button>

                    <Popup
                        transitionOptions={transitionOptions}
                        closeOnClickOutside
                        closeOnEscape
                        focused
                        preferredAlignment="top"
                        leaderElementOrRectRef={buttonRef}
                    >
                        <EmojiPicker onEmojiPick={insert}/>
                    </Popup>
                </>
            )}
        </OverlayContextProvider>
    );
};