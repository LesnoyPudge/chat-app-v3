import { AnimatedTransition, Button, Conditional, EmojiPicker, EmojiSwitcher, OverlayContextProvider, OverlayItem, RefContextProvider, RelativelyPositioned, Scrollable } from '@components';
import { useResizeObserver } from '@hooks';
import { SlateContainer, SlateEditor, useSlateAddEmoji } from '@libs';
import { animated } from '@react-spring/web';
import { PropsWithClassName } from '@types';
import { parseSlateContent } from '@utils';
import { FC, useContext, useRef, useState } from 'react';
import { Descendant } from 'slate';
import { ReactEditor, useSlateStatic } from 'slate-react';
import { useEventListener } from 'usehooks-ts';
import { MessageContext } from '../../Message';



export const MessageRedactor: FC<PropsWithClassName> = ({
    className = '',
}) => {
    const { message, isInEditMode, handleSaveRedactedMessage } = useContext(MessageContext) as MessageContext;
    const [redactorValue, setRedactorValue] = useState<Descendant[]>(() => (parseSlateContent(message.content)));

    return (
        <Conditional isRendered={isInEditMode}>
            <SlateContainer
                value={redactorValue} 
                onChange={setRedactorValue}
            >
                <MessageRedactorInner 
                    className={className}
                    onSave={() => handleSaveRedactedMessage(redactorValue)}
                />
            </SlateContainer>
        </Conditional>
    );
};

interface MessageRedactorInner extends PropsWithClassName {
    onSave: () => void;
}

const styles = {
    editorWrapper: 'flex items-start rounded-md bg-primary-100 min-h-[44px] max-h-[50vh]',
    scrollable: 'h-full',
    emojiSwitcher: 'w-11 h-11 p-2',
    controlWrapper: 'text-xs text-color-primary mt-1',
    controlButton: 'inline',
};

const MessageRedactorInner: FC<MessageRedactorInner> = ({
    className = '',
    onSave,
}) => {
    const { toggleIsInEditMode, handleSaveRedactedMessage } = useContext(MessageContext) as MessageContext;
    const { addEmoji } = useSlateAddEmoji();
    const editor = useSlateStatic();
    const editorWrapperRef = useRef<HTMLDivElement | null>(null);

    useResizeObserver(() => ReactEditor.toDOMNode(editor, editor), ([entry]) => {
        if (!editorWrapperRef.current) return;
        editorWrapperRef.current.style.height = entry.borderBoxSize[0].blockSize + 'px';
    });

    useEventListener('keydown', (e) => {
        if (e.key === 'Escape') toggleIsInEditMode();
    });

    return (
        <div className={className}>
            <div 
                className={styles.editorWrapper}
                ref={editorWrapperRef}
            >
                <Scrollable 
                    className={styles.scrollable}
                    label='Редактируемое сообщение'
                    small
                    autoHide
                >
                    <SlateEditor
                        placeholder='Введите отредактированное сообщение'
                        label='Редактируемое сообщение'
                        onSubmit={handleSaveRedactedMessage}
                    />
                </Scrollable>

                <OverlayContextProvider>
                    {({ isOverlayExist, openOverlay }) => (
                        <RefContextProvider>
                            {({ targetRef }) => (
                                <>
                                    <EmojiSwitcher 
                                        className={styles.emojiSwitcher}
                                        isActive={isOverlayExist}
                                    >
                                        {({ content, switchEmojiCode, wrapperClassName }) => (
                                            <Button 
                                                className={wrapperClassName}
                                                label='Выбрать эмодзи'
                                                hasPopup='dialog'
                                                isActive={isOverlayExist}
                                                onMouseEnter={switchEmojiCode}
                                                onLeftClick={openOverlay}
                                            >
                                                {content}
                                            </Button>
                                        )}
                                    </EmojiSwitcher>

                                    <AnimatedTransition isExist={isOverlayExist}>
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
                                                    targetRefOrRect={targetRef}
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
                        </RefContextProvider>
                    )}
                </OverlayContextProvider>
            </div>

            <div className={styles.controlWrapper}>
                <>Esc для </>

                <Button 
                    className={styles.controlButton}
                    stylingPreset='link'
                    label='Отменить редактирование'
                    onLeftClick={toggleIsInEditMode}
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