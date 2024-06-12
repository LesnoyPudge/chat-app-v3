import { PropsWithClassName } from '@types';
import { Form, Formik } from 'formik';
import { FC, useCallback, useContext, useMemo, useRef } from 'react';
import { Button, FileInput, LoadedEntityContext, MessageEditor, OverlayContextProvider, RTEModules, RTETypes, RichTextEditor, SpriteImage } from '@components';
import { localStorageApi, twClassNames } from '@utils';
import { Descendant } from 'slate';
import { MessageApi } from '@redux/features';
import { Entities, MBToBytes } from '@shared';
import { AlertOverlays, Attachments, FileDropModal, OpenEmojiPickerButton } from './components';
import { FormikFileInput } from '@libs';
import { shallowEqual } from 'react-redux';
import { JSONView } from '@dev';



export type MessageInputFormValues = {
    content: RTETypes.Nodes;
    attachments: Entities.File.Encoded[];
}

// const styles = {
//     wrapper: 'px-4 pt-4 pb-6',
//     editable: 'message-font-size',
// };

const styles = {
    wrapper: 'px-4 pt-4 pb-6',
    inputWrapper: 'flex',
    button: 'group/button w-11 h-11 p-2.5 sticky top-0 rounded-lg shrink-0',
    icon: `w-full h-full fill-icon-200 group-hover/button:fill-icon-100 
    group-focus-visible/button:fill-icon-100`,
    emojiButton: 'p-1',
    editable: 'w-full',
};

export const MessageInputBar: FC<PropsWithClassName> = ({
    className = '',
}) => {
    const [chat] = useContext(LoadedEntityContext.Chat);
    const [create, { isLoading }] = MessageApi.useMessageCreateMutation();
    const editorRef = useRef<RTETypes.Editor | null>(null);

    // const initialValues: MessageInputFormValues = useMemo(() => ({
    //     content: (
    //         localStorageApi.get('savedMessageDrafts')?.[chat.id]
    //         ?? RTEModules.Utils.createInitialValue()
    //     ),
    //     attachments: [],
    // }), [chat.id]);
    const getInitialValue = useCallback(() => {
        return {
            content: (
                localStorageApi.get('savedMessageDrafts')?.[chat.id]
                ?? RTEModules.Utils.createInitialValue()
            ),
            attachments: [],
        } satisfies MessageInputFormValues;
    }, [chat.id])

    // console.log('update', chat.id, initialValues.content[0]);

    const handleLocalStorageSync = (value: RTETypes.Nodes) => {
        let drafts = localStorageApi.get('savedMessageDrafts');
        if (!drafts) {
            drafts = {};
        }

        drafts[chat.id] = value;
        localStorageApi.set('savedMessageDrafts', drafts);
    };

    const handleSubmit = async(value: MessageInputFormValues) => {
        if (isLoading) return;

        await create({
            chatId: chat.id,
            content: JSON.stringify(value.content),
            attachments: value.attachments,
        }).then(() => {
            const drafts = localStorageApi.get('savedMessageDrafts');
            if (!drafts) return;

            delete drafts[chat.id];
            localStorageApi.set('savedMessageDrafts', drafts);

            if (!editorRef.current) return;

            RTEModules.Utils.resetEditor(
                editorRef.current,
                RTEModules.Utils.createInitialValue(),
            );
        });
    };

    return (
        <Formik
            initialValues={getInitialValue()}
            enableReinitialize
            onSubmit={(valies, {resetForm}) => {
                handleSubmit(valies).finally(() => {
                    console.log('reset')
                    resetForm({values: {
                        attachments: [],
                        content: RTEModules.Utils.createInitialValue(),
                    }})
                })
            }}
        >
            {({ values, submitForm, setFieldValue }) => (
                <RichTextEditor.ContextProvider
                    initialValue={values.content}
                    value={values.content}
                    label='Введите сообщение'
                    name='content'
                    placeholder='Введите сообщение'
                    disabled={isLoading}
                    onSubmit={submitForm}
                    onChange={(value) => {
                        handleLocalStorageSync(value);
                        setFieldValue('content', value);
                    }}
                >
                    <JSONView data={values.content}/>
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
                                {({ fileInputProps, handleFileUpload, removeFile }) => (
                                    <Form className={twClassNames(styles.wrapper, className)}>
                                        <MessageEditor.Wrapper>
                                            <Attachments removeFile={removeFile}/>

                                            <div className={styles.inputWrapper}>
                                                <FileInput
                                                    className={styles.button}
                                                    {...fileInputProps}
                                                >
                                                    <SpriteImage
                                                        className={styles.icon}
                                                        name='ADD_FILE_ICON'
                                                    />
                                                </FileInput>

                                                <RichTextEditor.ContentEditable 
                                                    className={styles.editable}
                                                />

                                                <OpenEmojiPickerButton className={styles.button}/>

                                                <Button
                                                    className={styles.button}
                                                    type='submit'
                                                    label='Отправить сообщение'
                                                >
                                                    <SpriteImage
                                                        className={styles.icon}
                                                        name='SEND_MESSAGE_ICON'
                                                    />
                                                </Button>
                                            </div>
                                        </MessageEditor.Wrapper>

                                        <OverlayContextProvider>
                                            <FileDropModal handleFileUpload={handleFileUpload}/>
                                        </OverlayContextProvider>
                                    </Form>
                                )}
                            </FormikFileInput>
                        )}
                    </AlertOverlays>
                </RichTextEditor.ContextProvider>
            )}
        </Formik>
    )

    return (
        <Formik
            initialValues={getInitialValue()}
            enableReinitialize
            onSubmit={handleSubmit}
        >
            {({ submitForm, values, setFieldValue }) => (
                <RichTextEditor.ContextProvider
                    initialValue={values.content}
                    label='Введите сообщение'
                    name='content'
                    placeholder='Введите сообщение'
                    disabled={isLoading}
                    onSubmit={submitForm}
                    onChange={(value) => {
                        handleLocalStorageSync(value);
                        setFieldValue('content', value);
                    }}
                >
                    <Form className={twClassNames(styles.wrapper, className)}>
                        <MessageEditor.Wrapper>
                            <RichTextEditor.ContentEditable className={styles.editable}/>
                        </MessageEditor.Wrapper>
                    </Form>
                </RichTextEditor.ContextProvider>
            )}
        </Formik>
    );
};