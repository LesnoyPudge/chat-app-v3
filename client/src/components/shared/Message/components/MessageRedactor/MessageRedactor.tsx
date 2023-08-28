import { AnimatedTransition, Button, EmojiPicker, EmojiSwitcher, MessageEditorWrapper, OverlayContextProvider, OverlayItem, Ref, RelativelyPositioned } from '@components';
import { SlateContainer, SlateEditor, useSlateAddEmoji } from '@libs';
import { animated } from '@react-spring/web';
import { PropsWithClassName } from '@types';
import { getTransitionOptions, parseSlateContent, twClassNames } from '@utils';
import { FC, useContext, useRef, useState } from 'react';
import { Descendant } from 'slate';
import { useEventListener } from 'usehooks-ts';
import { MessageContext } from '../../Message';



interface MessageRedactorInner extends PropsWithClassName {
    onSave: () => void;
    onCancel: () => void;
}

const styles = {
    editorWrapper: 'flex items-start rounded-md bg-primary-100 min-h-[44px] max-h-[50vh]',
    scrollable: 'h-full',
    emojiButton: 'w-11 h-11 p-2.5 sticky top-0 rounded-lg shrink-0',
    controlWrapper: 'text-xs text-color-primary mt-1',
    controlButton: 'inline',
};

const transitionOptions = getTransitionOptions.withOpacity();

export const MessageRedactor: FC<PropsWithClassName> = ({
    className = '',
}) => {
    const {
        message,
        isInRedactorMode,
        handleSaveEditor,
        handleCloseEditor,
    } = useContext(MessageContext);
    const [redactorValue, setRedactorValue] = useState<Descendant[]>(() => (parseSlateContent(message.content)));

    const handleSave = () => handleSaveEditor(redactorValue);
    const handleCancel = () => {
        setRedactorValue(parseSlateContent(message.content));
        handleCloseEditor();
    };

    return (
        <If condition={isInRedactorMode}>
            <SlateContainer
                value={redactorValue}
                onChange={setRedactorValue}
            >
                <MessageRedactorInner
                    className={className}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            </SlateContainer>
        </If>
    );
};

const MessageRedactorInner: FC<MessageRedactorInner> = ({
    className = '',
    onSave,
    onCancel,
}) => {
    const { addEmoji } = useSlateAddEmoji();
    const isEmojiPickerOpenRef = useRef(false);

    useEventListener('keydown', (e) => {
        if (isEmojiPickerOpenRef.current) return;
        if (e.key !== 'Escape') return;

        onCancel();
    });

    return (
        <div className={className}>
            <MessageEditorWrapper>
                <div className='flex'>
                    <SlateEditor
                        placeholder='Введите отредактированное сообщение'
                        label='Редактируемое сообщение'
                        onSubmit={onSave}
                    />

                    <OverlayContextProvider>
                        {({ isOverlayExist, openOverlay }) => {
                            isEmojiPickerOpenRef.current = isOverlayExist;

                            return (
                                <Ref<HTMLButtonElement>>
                                    {(ref) => (
                                        <>
                                            <EmojiSwitcher isActive={isOverlayExist}>
                                                {({ emojiComponent, switchEmojiCode, wrapperClassName }) => (
                                                    <Button
                                                        className={twClassNames(
                                                            styles.emojiButton,
                                                            wrapperClassName,
                                                        )}
                                                        label='Выбрать эмодзи'
                                                        hasPopup='dialog'
                                                        innerRef={ref}
                                                        isActive={isOverlayExist}
                                                        onMouseEnter={switchEmojiCode}
                                                        onLeftClick={openOverlay}
                                                    >
                                                        {emojiComponent}
                                                    </Button>
                                                )}
                                            </EmojiSwitcher>

                                            <AnimatedTransition
                                                isExist={isOverlayExist}
                                                transitionOptions={transitionOptions}
                                            >
                                                {({ isAnimatedExist, style }) => (
                                                    <OverlayItem
                                                        isRendered={isAnimatedExist}
                                                        blockable
                                                        blocking
                                                        closeOnClickOutside
                                                        closeOnEscape
                                                        focused
                                                    >
                                                        <RelativelyPositioned
                                                            preferredAlignment='top'
                                                            swappableAlignment
                                                            leaderElementOrRectRef={ref}
                                                        >
                                                            <animated.div
                                                                style={style}
                                                                role='dialog'
                                                                aria-label='Выбрать эмодзи'
                                                            >
                                                                <EmojiPicker onEmojiAdd={addEmoji}/>
                                                            </animated.div>
                                                        </RelativelyPositioned>
                                                    </OverlayItem>
                                                )}
                                            </AnimatedTransition>
                                        </>
                                    )}
                                </Ref>
                            );
                        }}
                    </OverlayContextProvider>
                </div>
            </MessageEditorWrapper>

            <div className={styles.controlWrapper}>
                <>Esc для </>

                <Button
                    className={styles.controlButton}
                    stylingPreset='link'
                    label='Отменить редактирование'
                    onLeftClick={onCancel}
                >
                    <>отмены</>
                </Button>

                <> | Enter чтобы </>

                <Button
                    className={styles.controlButton}
                    stylingPreset='link'
                    label='Сохранить отредактированное сообщение'
                    onLeftClick={onSave}
                >
                    <>сохранить</>
                </Button>
            </div>
        </div>
    );
};