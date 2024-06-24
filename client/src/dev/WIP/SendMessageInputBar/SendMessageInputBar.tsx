import { RichTextEditor } from '@components';
import { PropsWithClassName } from '@types';
import { Formik, Form } from 'formik';
import { FC } from 'react';
import { MessageEditor } from '../MessageEditor';
import { useSendMessageFormControls } from './hooks';



type SendMessageInputBar = PropsWithClassName & {
    chatId: string;
}

export const SendMessageInputBar: FC<SendMessageInputBar> = ({
    className = '',
    chatId,
}) => {
    const {
        isLoading,
        getInitialValue,
        handleSubmit,
        onRTEValueChangeWrapper,
    } = useSendMessageFormControls(chatId);

    return (
        <Formik
            initialValues={getInitialValue()}
            enableReinitialize
            onSubmit={handleSubmit}
        >
            {({ values, submitForm, setFieldValue }) => (
                <RichTextEditor.ContextProvider
                    name='content'
                    value={values.content}
                    onChange={onRTEValueChangeWrapper((v) => {
                        setFieldValue('content', v);
                    })}
                    onSubmit={submitForm}
                    disabled={isLoading}
                >
                    <Form className={className}>
                        <MessageEditor.Wrapper>
                            <MessageEditor.Scroll>
                                <MessageEditor.AttachmentUploadProvider>
                                    <MessageEditor.Attachments/>

                                    <MessageEditor.ControlsWrapper>
                                        <MessageEditor.AttachmentButton/>

                                        <RichTextEditor.ContentEditable/>

                                        <MessageEditor.EmojiPickerButton/>

                                        <MessageEditor.SubmitButton/>
                                    </MessageEditor.ControlsWrapper>
                                </MessageEditor.AttachmentUploadProvider>
                            </MessageEditor.Scroll>
                        </MessageEditor.Wrapper>
                    </Form>
                </RichTextEditor.ContextProvider>
            )}
        </Formik>
    );
};