import { FC } from 'react';
import { SlateEditor, SlateContainer, FormikFileInput } from '@libs';
import { Button, Icon, MessageEditorWrapper } from '@components';
import { FileDrop, OpenEmojiPickerButton } from './components';
import { Form, Formik } from 'formik';



interface IMessageInputBar {
    className?: string;
    placeholder?: string;
}

const styles = {
    button: 'group/button w-11 h-11 p-2.5 sticky top-0 rounded-lg shrink-0',
    icon: `w-full h-full fill-icon-200 group-hover/button:fill-icon-100 
    group-focus-visible/button:fill-icon-100`,
    emojiButton: 'p-1',
};

export const MessageInputBar: FC<IMessageInputBar> = ({
    className = '',
    placeholder,
}) => {
    return (
        <Formik initialValues={{}} onSubmit={() => {}}>
            <Form className={className}>
                <SlateContainer>
                    <MessageEditorWrapper>
                        <FormikFileInput 
                            className={styles.button} 
                            label='' 
                            name=''
                        >
                            <Icon
                                className={styles.icon}
                                iconId='add-file-icon'
                            />
                        </FormikFileInput>

                        <SlateEditor
                            placeholder={placeholder}
                            label='Введите сообщение'
                            onSubmit={() => console.log('submit!!')}
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
                    </MessageEditorWrapper>
                </SlateContainer>

                <FileDrop/>
            </Form>
        </Formik>
    );
};