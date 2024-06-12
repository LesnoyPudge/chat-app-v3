// message input

import { AnimatedTransition, Button, Emoji, EmojiCode, EmojiPicker, EntityContextProvider, FileInput, MessageEditor, OverlayContextProvider, Popup, RTEModules, RTETypes, RichTextEditor, Scrollable, SpriteImage, uniqueEmojiCodeList } from "@components";
import { PropsWithChildrenAndClassName, PropsWithChildrenAsNodeOrFunction, PropsWithClassName } from "@types";
import { MBToBytes, cn, getRandomNumber, getTransitionOptions, localStorageApi, noop, twClassNames } from "@utils";
import { FC, Suspense, lazy, useCallback, useRef, useState } from "react";
import ReactFocusLock from "react-focus-lock";
import { JSONView } from "../JSONView";
import { ChatV3 } from "src/components/shared/ChatV2/ChatV2";
import { BaseSelection } from "slate";
import { useSlateSelection } from "slate-react";
import { FormikFileInput, FormikFileInputChildrenArgs } from "@libs";
import { AlertOverlays, Attachments, FileDropModal, OverflowModal } from "src/components/shared/ChatV2/components/MessageInputBar/components";
import { Form, Formik } from "formik";
import { Entities } from "../../../../shared/types";

const MessageEditorControlsWrapper: FC<PropsWithChildrenAndClassName> = ({
    className = '',
    children,
}) => {
    const styles = {
        wrapper: 'flex'
    }

    return (
        <div className={cn(styles.wrapper, className)}>
            {children}
        </div>
    )
};

const styles = {
    stickyControl: 'h-message-editor aspect-square sticky top-0',
    buttonWithIcon: 'group/button p-2.5',
    icon: `w-full h-full fill-icon-200 group-hover/button:fill-icon-100 
    group-focus-visible/button:fill-icon-100`,
}



const MessageEditorSubmitButton: FC = () => {
    return (
        <Button
            className={cn(styles.buttonWithIcon, styles.stickyControl)}
            type='submit'
            label='Отправить сообщение'
            // disabled={isLoading}
        >
            <SpriteImage
                className={styles.icon}
                name='SEND_MESSAGE_ICON'
            />
        </Button>
    )
}



const useEmojiSwitcher = (emojiCodeList: EmojiCode[]) => {
    const prevIndexRef = useRef<number | null>(null);
    
    const getEmojiCode = useCallback(() => {
        const length = emojiCodeList.length;
        const rangeEnd = length - 1;
        let index = getRandomNumber(0, rangeEnd);

        if (prevIndexRef.current !== null) {
            while (index === prevIndexRef.current) {
                index = getRandomNumber(0, rangeEnd);
            }
        }

        prevIndexRef.current = index;
    
        return emojiCodeList[index];
    }, [emojiCodeList]);

    const [emojiCode, setEmojiCode] = useState(() => getEmojiCode());
    
    const changeEmoji = useCallback(() => {
        setEmojiCode(getEmojiCode());
    }, [getEmojiCode]);

    return {
        emojiCode,
        changeEmoji,
    }
}

export const MessageEditorEmojiPickerButton: FC<PropsWithClassName> = ({
    className = '',
}) => {
    const { insert } = RTEModules.Emoji.useInsertEmoji();
    const localStyles = {
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
    const transitionOptions = getTransitionOptions.withOpacity();
    const buttonRef = useRef<HTMLButtonElement>(null);
    const {changeEmoji, emojiCode} = useEmojiSwitcher(uniqueEmojiCodeList);

    return (
        <OverlayContextProvider>
            {({ openOverlay, isOverlayExist }) => (
                <>
                    <Button
                        className={cn(
                            styles.stickyControl, 
                            localStyles.button,
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
                                localStyles.emoji.base, 
                                { [localStyles.emoji.active]: isOverlayExist },
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

export const MessageEditorAttachmentButton: FC<
    Pick<FormikFileInputChildrenArgs<true>, 'fileInputProps' | 'handleFileUpload'>
> = ({
    fileInputProps,
    handleFileUpload,
}) => {
    return (
        <>
            <FileInput
                className={cn(styles.stickyControl, styles.buttonWithIcon)}
                {...fileInputProps}
            >
                <SpriteImage
                    className={styles.icon}
                    name='ADD_FILE_ICON'
                />
            </FileInput>

            <OverlayContextProvider>
                <FileDropModal handleFileUpload={handleFileUpload}/>
            </OverlayContextProvider>
        </>
    )
}

export const MessageEditorAttachmentUploadWrapper: FC<
    PropsWithChildrenAsNodeOrFunction<FormikFileInputChildrenArgs<true>>
> = ({children}) => {
    return (
        <AlertOverlays>
            {({ overflowModalHelpers, sizeModalHelpers }) => (
                <FormikFileInput
                    name='attachments'
                    label='Добавить вложение'
                    options={{
                        accept: '*',
                        amountLimit: 9,
                        sizeLimit: MBToBytes(8),
                    }}
                    multiple
                    onAmountLimit={overflowModalHelpers.openOverlay}
                    onSizeLimit={sizeModalHelpers.openOverlay}
                >
                    {children}
                </FormikFileInput>
            )}
        </AlertOverlays>
    )
}

export type MessageInputFormValues = {
    content: RTETypes.Nodes;
    attachments: Entities.File.Encoded[];
}

const useSendMessageFormControls = (id: string) => {
    // const [create, { isLoading }] = MessageApi.useMessageCreateMutation();

    const getInitialValue = useCallback(() => {
        return {
            content: (
                localStorageApi.get('savedMessageDrafts')?.[id]
                ?? RTEModules.Utils.createInitialValue()
            ),
            attachments: [],
        } satisfies MessageInputFormValues;
    }, [id])

    const handleSubmit = async(value: MessageInputFormValues) => {
        // if (isLoading) return;

        // await create({
        //     chatId: chat.id,
        //     content: JSON.stringify(value.content),
        //     attachments: value.attachments,
        // }).then(() => {
            const drafts = localStorageApi.get('savedMessageDrafts');
            if (!drafts) return;

            delete drafts[id];
            localStorageApi.set('savedMessageDrafts', drafts);

        //     if (!editorRef.current) return;

        //     RTEModules.Utils.resetEditor(
        //         editorRef.current,
        //         RTEModules.Utils.createInitialValue(),
        //     );
        // });
    };

    const onRTEValueChangeWrapper = (cb: (value: RTETypes.Nodes) => void) => {
        return (value: RTETypes.Nodes) => {
            let drafts = localStorageApi.get('savedMessageDrafts');
            if (!drafts) {
                drafts = {};
            }

            drafts[id] = value;
            localStorageApi.set('savedMessageDrafts', drafts);

            cb(value)
        }
    }

    return {
        isLoading: false,
        getInitialValue,
        onRTEValueChangeWrapper,
        handleSubmit,
    }
}

const RoomChat: FC<PropsWithClassName> = ({
    className = ''
}) => {
    

    // const [chat] = useContext(LoadedEntityContext.Chat);
    const roomChat = {
        id: '123'
    }

    const {
        isLoading,
        getInitialValue,
        handleSubmit,
        onRTEValueChangeWrapper,
    } = useSendMessageFormControls(roomChat.id);
    

    return (
        <div>
            <div>RoomChat</div>

            <Formik
                initialValues={getInitialValue()}
                enableReinitialize
                onSubmit={(values, {resetForm}) => {
                    handleSubmit(values).finally(() => {
                        console.log('reset')
                        resetForm({values: getInitialValue()})
                    })
                }}
                // add to custom form component
                // disabled={isLoading}
            >
                {({ values, submitForm, setFieldValue }) => (
                    <RichTextEditor.ContextProvider
                        name="content"
                        value={values.content}
                        onChange={onRTEValueChangeWrapper((v) => {
                            setFieldValue('content', v);
                        })}
                        onSubmit={submitForm}
                        disabled={isLoading}
                    >
                        <MessageEditor.Wrapper className={className}>
                            <MessageEditorAttachmentUploadWrapper>
                                {({removeFile, fileInputProps, handleFileUpload}) => (
                                    <>
                                        <Attachments removeFile={removeFile}/>

                                        <MessageEditorControlsWrapper>
                                            <MessageEditorAttachmentButton
                                                fileInputProps={fileInputProps}
                                                handleFileUpload={handleFileUpload}
                                            />

                                            <RichTextEditor.ContentEditable/>

                                            <MessageEditorEmojiPickerButton/>

                                            <MessageEditorSubmitButton/>
                                        </MessageEditorControlsWrapper>
                                    </>
                                )}
                            </MessageEditorAttachmentUploadWrapper>
                        </MessageEditor.Wrapper>
                    </RichTextEditor.ContextProvider>
                )}
            </Formik>
        </div>
    )
}

const PrivateChat: FC = () => {
    const roomChat = {
        id: '123'
    }

    const {
        isLoading,
        getInitialValue,
        handleSubmit,
        onRTEValueChangeWrapper,
    } = useSendMessageFormControls(roomChat.id);

    return (
        <div>
            <div>PrivateChat</div>

            <RichTextEditor.ContextProvider name="">
                <RichTextEditor.ContentEditable/>
            </RichTextEditor.ContextProvider>
        </div>
    )
}

const MessageRedactor: FC<PropsWithClassName> = ({
    className = ''
}) => {
    const getInitialValue = () => ({
        content: RTEModules.Utils.createInitialValue()
    })

    return (
        <div>
            <div>MessageRedactor</div>

            <Formik
                initialValues={getInitialValue()}
                enableReinitialize
                onSubmit={(values, {resetForm}) => {
                    // handleSubmit(values).finally(() => {
                    //     console.log('reset')
                    //     resetForm({values: getInitialValue()})
                    // })
                }}
                // add to custom form component
                // disabled={isLoading}
            >
                {({ values, submitForm, setFieldValue, isSubmitting }) => (
                    <RichTextEditor.ContextProvider
                        name="content"
                        value={values.content}
                        onChange={(v) => setFieldValue('content', v)}
                        onSubmit={submitForm}
                        disabled={isSubmitting}
                    >
                        <MessageEditor.Wrapper className={className}>
                            <MessageEditorControlsWrapper>
                                <RichTextEditor.ContentEditable/>

                                <MessageEditorEmojiPickerButton/>
                            </MessageEditorControlsWrapper>
                        </MessageEditor.Wrapper>
                    </RichTextEditor.ContextProvider>
                )}
            </Formik>
        </div>
    )
}

import { MessageEditor as MessageEditor2 } from "./MessageEditor";

export const Main: FC = () => {

    return (
        <ReactFocusLock>
            <div className="flex flex-col gap-16 p-8 max-h-screen overflow-y-scroll">
                
                
                <RichTextEditor.ContextProvider name="">
                    <MessageEditor2.Wrapper focused>
                        <RichTextEditor.ContentEditable/>
                    </MessageEditor2.Wrapper>
                </RichTextEditor.ContextProvider>
                
                {/* <EntityContextProvider.User id="" fakeEntity={{
                    avatarId: '',
                    blocked: [],
                    extraStatus: 'default',
                    id: '',
                    isDeleted: false,
                    login: '',
                    status: 'online',
                    username: 'qwe'
                }}>
                    <MessageEditor.Blocked/>
                </EntityContextProvider.User>

                <MessageEditor.Disabled>
                    <>disabled for some reason</>
                </MessageEditor.Disabled>

                <MessageEditor.Placeholder/>

                <Formik initialValues={{}} onSubmit={() => {}}>
                    <RichTextEditor.ContextProvider name="">
                        {({}) => (
                            <MessageEditor.Wrapper></MessageEditor.Wrapper>
                        )}
                    </RichTextEditor.ContextProvider>
                </Formik> */}

                {/* <RoomChat/> */}

                {/* <PrivateChat/> */}

                <MessageRedactor/>
            </div>
        </ReactFocusLock>
    )
}