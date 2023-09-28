import { PropsWithClassName } from '@types';
import { Form, Formik } from 'formik';
import { FC, useContext, useMemo } from 'react';
import { LoadedEntityContext, MessageEditor, RichTextEditor } from '@components';
import { localStorageApi, twClassNames } from '@utils';
import { Descendant } from 'slate';
import { getInitialSlateValue } from '@libs';
import { MessageApi } from '@redux/features';
import { Entities } from '@shared';



type MessageInputFormValues = {
    content: Descendant[];
    attachments: Entities.File.Encoded[];
}

const styles = {
    wrapper: 'px-4 pt-4 pb-6',
    editable: 'message-font-size',
};

export const MessageInputBar: FC<PropsWithClassName> = ({
    className = '',
}) => {
    const [chat] = useContext(LoadedEntityContext.Chat);
    const [create, { isLoading }] = MessageApi.useMessageCreateMutation();

    const initialValues: MessageInputFormValues = useMemo(() => ({
        content: localStorageApi.get('savedMessageDrafts')?.[chat.id] ?? getInitialSlateValue(),
        attachments: [],
    }), [chat.id]);

    console.log('update', chat.id, initialValues.content[0]);

    const handleLocalStorageSync = (value: Descendant[]) => {
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
        });
    };

    return (
        <Formik
            initialValues={initialValues}
            enableReinitialize
            onSubmit={handleSubmit}
        >
            {({ submitForm, values, setFieldValue }) => (
                <RichTextEditor.ContextProvider
                    value={values.content}
                    label='Введите сообщение'
                    name='content'
                    placeholder='Введите сообщение'
                    onSubmit={submitForm}
                    onChange={(value) => {
                        handleLocalStorageSync(value);
                        setFieldValue('content', value);
                    }}
                >
                    <Form className={twClassNames(styles.wrapper, className)}>
                        <MessageEditor.Wrapper>
                            <RichTextEditor.Editable className={styles.editable}/>
                        </MessageEditor.Wrapper>
                    </Form>
                </RichTextEditor.ContextProvider>
            )}
        </Formik>
    );
};