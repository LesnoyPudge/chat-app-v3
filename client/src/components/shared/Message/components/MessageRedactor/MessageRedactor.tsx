import { AnimatedTransition, Button, EmojiPicker, EmojiSwitcher, MessageEditor, OverlayContextProvider, OverlayItem, RTEModules, RTETypes, Ref, RelativelyPositioned, RichTextEditor } from '@components';
import { animated } from '@react-spring/web';
import { PropsWithClassName } from '@types';
import { createValidationSchema, getTransitionOptions, twClassNames } from '@utils';
import { FC, useContext } from 'react';
import { MessageContext } from '../../Message';
import { Form, Formik } from 'formik';
import { Key } from 'ts-key-enum';



type RedactorFormValues = {
    content: RTETypes.Nodes;
}

const styles = {
    emojiButton: 'w-11 h-11 p-2.5 sticky top-0 rounded-lg shrink-0',
    controlWrapper: 'text-xs text-color-primary mt-1',
    controlButton: 'inline',
    inner: 'flex',
    editable: 'message-font-size',
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

    const initialValues: RedactorFormValues = {
        content: RTEModules.Utils.parse(message.content),
    };

    const handleEscape = (e: KeyboardEvent) => {
        if (e.key !== Key.Escape) return;

        handleCloseEditor();
    };

    const handleSubmit = (values: RedactorFormValues) => {
        handleSaveEditor(values.content);
    };

    const validationSchema = createValidationSchema<RedactorFormValues>(({
        yup,
        VALIDATION_MESSAGES,
    }) => ({
        content: yup.array().test({
            test: (v) => {
                throw new Error(`todo ${JSON.stringify(v)}`);

                if (!message.attachments.length) {
                    // текст должен быть не пустым тк нет вложений
                }

                return true
            },
            message: VALIDATION_MESSAGES.REQUIRED,
        })
        // content: yup.array().test({
        //     test: (v) => {
        //         return true
        //         // return isDescendantArray(v) && !isDescendantEmpty(v);
        //     },
        //     message: VALIDATION_MESSAGES.REQUIRED,
        // }),
    }));

    return (
        <If condition={isInRedactorMode}>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ submitForm, values, setFieldValue }) => (
                    <RichTextEditor.ContextProvider
                        initialValue={values.content}
                        label='Редактор'
                        name='content'
                        placeholder='Введите сообщение'
                        // onSubmit={submitForm}
                        // onKeyDown={handleEscape}
                        onChange={(v) => setFieldValue('content', v)}
                    >
                        <MessageRedactorInner className={className}/>
                    </RichTextEditor.ContextProvider>
                )}
            </Formik>
        </If>
    );
};

const MessageRedactorInner: FC<PropsWithClassName> = ({
    className = '',
}) => {
    const { handleCloseEditor } = useContext(MessageContext);
    const { insert } = RTEModules.Emoji.useInsertEmoji();

    return (
        <Form className={className}>
            <MessageEditor.Wrapper>
                <div className={styles.inner}>
                    <RichTextEditor.ContentEditable className={styles.editable}/>

                    <OverlayContextProvider>
                        {({ isOverlayExist, openOverlay }) => (
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
                                                            <EmojiPicker onEmojiPick={insert}/>
                                                        </animated.div>
                                                    </RelativelyPositioned>
                                                </OverlayItem>
                                            )}
                                        </AnimatedTransition>
                                    </>
                                )}
                            </Ref>
                        )}
                    </OverlayContextProvider>
                </div>
            </MessageEditor.Wrapper>

            <div className={styles.controlWrapper}>
                <>Esc для </>

                <Button
                    className={styles.controlButton}
                    stylingPreset='link'
                    label='Отменить редактирование'
                    onLeftClick={handleCloseEditor}
                >
                    <>отмены</>
                </Button>

                <> | Enter чтобы </>

                <Button
                    className={styles.controlButton}
                    stylingPreset='link'
                    label='Сохранить отредактированное сообщение'
                    type='submit'
                >
                    <>сохранить</>
                </Button>
            </div>
        </Form>
    );
};