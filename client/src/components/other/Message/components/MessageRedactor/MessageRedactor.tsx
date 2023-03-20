import { IMessage } from '@backendTypes';
import { AnimatedTransition, Button, Conditional, EmojiCode, EmojiPicker, EmojiSwitcher, MessageEditorWrapper, OverlayContextProvider, OverlayItem, RefContextProvider, RelativelyPositioned } from '@components';
import { SlateContainer, SlateEditor, useSlateAddEmoji } from '@libs';
import { animated } from '@react-spring/web';
import { PropsWithClassName } from '@types';
import { parseSlateContent, twClassNames } from '@utils';
import { FC, useContext, useRef, useState } from 'react';
import { Descendant } from 'slate';
import { useEventListener } from 'usehooks-ts';
import { MessageContext } from '../../Message';



interface MessageRedactorInner extends PropsWithClassName {
    onSave: () => void;
    onCancel: () => void;
}

interface MessageRedactor extends PropsWithClassName {
    message: IMessage & {reactions: {code: EmojiCode, users: string[]}[]};
    isInEditMode: boolean;
    saveEditor: (value: Descendant[]) => void;
    closeEditor: () => void;
}

const styles = {
    editorWrapper: 'flex items-start rounded-md bg-primary-100 min-h-[44px] max-h-[50vh]',
    scrollable: 'h-full',
    emojiButton: 'w-11 h-11 p-2.5 sticky top-0 rounded-lg shrink-0',
    controlWrapper: 'text-xs text-color-primary mt-1',
    controlButton: 'inline',
};

export const MessageRedactor: FC<MessageRedactor> = ({
    className = '',
    closeEditor,
    isInEditMode,
    message,
    saveEditor,
}) => {
    const [redactorValue, setRedactorValue] = useState<Descendant[]>(() => (parseSlateContent(message.content)));

    const handleSave = () => saveEditor(redactorValue);
    const handleCancel = () => {
        setRedactorValue(parseSlateContent(message.content));
        closeEditor();
    };

    return (
        <Conditional isRendered={isInEditMode}>
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
        </Conditional>
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
                                <RefContextProvider>
                                    {({ targetRef }) => (
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
                                                        isActive={isOverlayExist}
                                                        onMouseEnter={switchEmojiCode}
                                                        onLeftClick={openOverlay}
                                                    >
                                                        {emojiComponent}
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

// interface MessageRedactorInner extends PropsWithClassName {
//     onSave: () => void;
//     onCancel: () => void;
// }

// const styles = {
//     editorWrapper: 'flex items-start rounded-md bg-primary-100 min-h-[44px] max-h-[50vh]',
//     scrollable: 'h-full',
//     emojiButton: 'w-11 h-11 p-2.5 sticky top-0 rounded-lg shrink-0',
//     controlWrapper: 'text-xs text-color-primary mt-1',
//     controlButton: 'inline',
// };

// export const MessageRedactor: FC<PropsWithClassName> = ({
//     className = '',
// }) => {
//     const { 
//         message, 
//         isInEditMode, 
//         handleSaveRedactedMessage, 
//         toggleIsInEditMode, 
//     } = useContext(MessageContext) as MessageContext;
//     const [redactorValue, setRedactorValue] = useState<Descendant[]>(() => (parseSlateContent(message.content)));

//     const handleSave = () => handleSaveRedactedMessage(redactorValue);
//     const handleCancel = () => {
//         setRedactorValue(parseSlateContent(message.content));
//         toggleIsInEditMode();
//     };

//     return (
//         <Conditional isRendered={isInEditMode}>
//             <SlateContainer
//                 value={redactorValue} 
//                 onChange={setRedactorValue}
//             >
//                 <MessageRedactorInner 
//                     className={className}
//                     onSave={handleSave}
//                     onCancel={handleCancel}
//                 />
//             </SlateContainer>
//         </Conditional>
//     );
// };

// const MessageRedactorInner: FC<MessageRedactorInner> = ({
//     className = '',
//     onSave,
//     onCancel,
// }) => {
//     const { addEmoji } = useSlateAddEmoji();
//     const isEmojiPickerOpenRef = useRef(false);

//     useEventListener('keydown', (e) => {
//         if (isEmojiPickerOpenRef.current) return;
//         if (e.key !== 'Escape') return;
        
//         onCancel();
//     });

//     return (
//         <div className={className}>
//             <MessageEditorWrapper>
//                 <div className='flex'>
//                     <SlateEditor
//                         placeholder='Введите отредактированное сообщение'
//                         label='Редактируемое сообщение'
//                         onSubmit={onSave}
//                     />

//                     <OverlayContextProvider>
//                         {({ isOverlayExist, openOverlay }) => {
//                             isEmojiPickerOpenRef.current = isOverlayExist;

//                             return (
//                                 <RefContextProvider>
//                                     {({ targetRef }) => (
//                                         <>
//                                             <EmojiSwitcher isActive={isOverlayExist}>
//                                                 {({ emojiComponent, switchEmojiCode, wrapperClassName }) => (
//                                                     <Button 
//                                                         className={twClassNames(
//                                                             styles.emojiButton, 
//                                                             wrapperClassName,
//                                                         )}
//                                                         label='Выбрать эмодзи'
//                                                         hasPopup='dialog'
//                                                         isActive={isOverlayExist}
//                                                         onMouseEnter={switchEmojiCode}
//                                                         onLeftClick={openOverlay}
//                                                     >
//                                                         {emojiComponent}
//                                                     </Button>
//                                                 )}
//                                             </EmojiSwitcher>

//                                             <AnimatedTransition isExist={isOverlayExist}>
//                                                 {({ isAnimatedExist, style }) => (
//                                                     <OverlayItem
//                                                         isRendered={isAnimatedExist}
//                                                         blockable
//                                                         blocking
//                                                         closeOnClickOutside
//                                                         closeOnEscape
//                                                         focused
//                                                     >
//                                                         <RelativelyPositioned
//                                                             preferredAlignment='top'
//                                                             swappableAlignment
//                                                             targetRefOrRect={targetRef}
//                                                         >
//                                                             <animated.div
//                                                                 style={style}
//                                                                 role='dialog'
//                                                                 aria-label='Выбрать эмодзи'
//                                                             >
//                                                                 <EmojiPicker onEmojiAdd={addEmoji}/>
//                                                             </animated.div>
//                                                         </RelativelyPositioned>
//                                                     </OverlayItem>
//                                                 )}
//                                             </AnimatedTransition>
//                                         </>
//                                     )}
//                                 </RefContextProvider>
//                             );
//                         }}
//                     </OverlayContextProvider>
//                 </div>
//             </MessageEditorWrapper>

//             <div className={styles.controlWrapper}>
//                 <>Esc для </>

//                 <Button 
//                     className={styles.controlButton}
//                     stylingPreset='link'
//                     label='Отменить редактирование'
//                     onLeftClick={onCancel}
//                 >
//                     <>отмены</>
//                 </Button>

//                 <> | Enter чтобы </>

//                 <Button 
//                     className={styles.controlButton}
//                     stylingPreset='link'
//                     label='Сохранить отредактированное сообщение'
//                     onLeftClick={onSave}
//                 >
//                     <>сохранить</>
//                 </Button>
//             </div>
//         </div>
//     );
// };