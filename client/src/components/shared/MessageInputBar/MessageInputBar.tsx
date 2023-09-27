import { FC } from 'react';
import { SlateEditor, SlateContainer, FormikFileInput, getInitialSlateValue, isDescendantEmpty } from '@libs';
import { Button,SpriteImage, FileInput, OverlayContextProvider, MessageEditor } from '@components';
import { OpenEmojiPickerButton, Attachments, SizeModal, FileDropModal, OverflowModal, AlertOverlays } from './components';
import { Form, Formik } from 'formik';
import { Descendant } from 'slate';
import { EncodedFile } from '@types';
import { MBToBytes, localStorageApi, twClassNames } from '@utils';



interface MessageInputBar {
    className?: string;
    placeholder?: string;
}

export interface MessageInputBarFormValues {
    content: Descendant[];
    attachments: EncodedFile[];
}

const styles = {
    wrapper: 'px-4 pt-4 pb-6',
    button: 'group/button w-11 h-11 p-2.5 sticky top-0 rounded-lg shrink-0',
    icon: `w-full h-full fill-icon-200 group-hover/button:fill-icon-100 
    group-focus-visible/button:fill-icon-100`,
    emojiButton: 'p-1',
};

export const MessageInputBar: FC<MessageInputBar> = ({
    className = '',
    placeholder,
}) => {
    // const savedDraft =

    // const oldRecord = localStorageApi.get('lastVisitedTextRooms');

    //     if (oldRecord) {
    //         oldRecord[room.channel] = room.id;
    //         localStorageApi.set('lastVisitedTextRooms', oldRecord);
    //     }

    //     if (!oldRecord) {
    //         localStorageApi.set('lastVisitedTextRooms', {
    //             [room.channel]: room.id,
    //         });
    //     }

    const initialValues: MessageInputBarFormValues = {
        content: getInitialSlateValue(),
        // content: localStorageApi.get('savedMessageDrafts')[] ?? getInitialSlateValue(),
        attachments: [],
    };

    const handleSubmit = (formValues: MessageInputBarFormValues) => {
        const isEmptyMessage = isDescendantEmpty(formValues.content) && !formValues.attachments.length;
        if (isEmptyMessage) return console.log('empty message');

        console.log('send message', formValues);
    };

    return (
        <>
            <div>wow</div>
        </>
    );

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
        >
            {({ values, submitForm, setFieldValue }) => (
                <SlateContainer
                    value={values.content}
                    onChange={(value) => setFieldValue('content', value)}
                >
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
                                    <>
                                        <Form className={twClassNames(styles.wrapper, className)}>
                                            <MessageEditor.Wrapper>
                                                <div>
                                                    <Attachments removeFile={removeFile}/>

                                                    <div className='flex'>
                                                        <FileInput
                                                            className={styles.button}
                                                            {...fileInputProps}
                                                        >
                                                            <SpriteImage
                                                                className={styles.icon}
                                                                name='ADD_FILE_ICON'
                                                            />
                                                        </FileInput>

                                                        <SlateEditor
                                                            placeholder={placeholder}
                                                            label='Введите сообщение'
                                                            onSubmit={submitForm}
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
                                                </div>
                                            </MessageEditor.Wrapper>
                                        </Form>

                                        <OverlayContextProvider>
                                            <FileDropModal handleFileUpload={handleFileUpload}/>
                                        </OverlayContextProvider>
                                    </>
                                )}
                            </FormikFileInput>
                        )}
                    </AlertOverlays>
                </SlateContainer>
            )}
        </Formik>
    );
};