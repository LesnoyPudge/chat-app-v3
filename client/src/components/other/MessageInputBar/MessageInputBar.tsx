import { FC } from 'react';
import { SlateEditor, SlateContainer, FormikFileInput, getInitialSlateValue, FormikFileUploadContextProvider, isDescendantEmpty } from '@libs';
import { Button, Icon, MessageEditorWrapper } from '@components';
import { OpenEmojiPickerButton, Attachments, AttachmentsModals } from './components';
import { Form, Formik } from 'formik';
import { Descendant } from 'slate';
import { EncodedFile } from '@types';
import { MBToBytes } from '@utils';



interface MessageInputBar {
    className?: string;
    placeholder?: string;
}

export interface MessageInputBarFormValues {
    content: Descendant[];
    attachments: EncodedFile[];
}

const initialValues: MessageInputBarFormValues = {
    content: getInitialSlateValue(),
    attachments: [],
};

const styles = {
    button: 'group/button w-11 h-11 p-2.5 sticky top-0 rounded-lg shrink-0',
    icon: `w-full h-full fill-icon-200 group-hover/button:fill-icon-100 
    group-focus-visible/button:fill-icon-100`,
    emojiButton: 'p-1',
};

export const MessageInputBar: FC<MessageInputBar> = ({
    className = '',
    placeholder,
}) => {
    const handleSubmit = (formValues: MessageInputBarFormValues) => {
        const isEmptyMessage = isDescendantEmpty(formValues.content) && !formValues.attachments.length;
        if (isEmptyMessage) return console.log('empty message');

        console.log('send message', formValues);      
    };

    return (
        <Formik 
            initialValues={initialValues} 
            onSubmit={handleSubmit}
        >
            {({ values, submitForm, setFieldValue }) => (
                <FormikFileUploadContextProvider 
                    name='attachments' 
                    label='Добавить вложение'
                    options={{
                        accept: '*',
                        amountLimit: 9,
                        sizeLimit: MBToBytes(8),
                    }}
                >
                    <Form className={className + ' m-4'}>
                        <SlateContainer
                            value={values.content}
                            onChange={(value) => setFieldValue('content', value)}
                        >
                            <MessageEditorWrapper>
                                <div>
                                    <Attachments/>
                                
                                    <div className='flex'>
                                        <FormikFileInput className={styles.button}>
                                            <Icon
                                                className={styles.icon}
                                                iconId='add-file-icon'
                                            />
                                        </FormikFileInput>

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
                                            <Icon
                                                className={styles.icon}
                                                iconId='send-message-icon'
                                            />
                                        </Button>
                                    </div>
                                </div>
                            </MessageEditorWrapper>
                        </SlateContainer>
                    </Form>

                    <AttachmentsModals/>
                </FormikFileUploadContextProvider>
            )}
        </Formik>
    );
};