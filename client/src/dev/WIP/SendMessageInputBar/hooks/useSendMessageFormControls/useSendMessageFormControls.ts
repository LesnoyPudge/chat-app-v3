import { RTEModules, RTETypes } from "@components";
import { Entities } from "@shared";
import { MessageApi } from "@redux/features";
import { useCallback } from "react";
import { localStorageApi } from "@utils";
import { FormikHelpers } from "formik";



type MessageInputFormValues = {
    content: RTETypes.Nodes;
    attachments: Entities.File.Encoded[];
}

const getDraft = (id: string) => {
    return localStorageApi.get('savedMessageDrafts')?.[id];
}

const deleteDraft = (id: string) => {
    const drafts = localStorageApi.get('savedMessageDrafts');
    if (!drafts) return;

    delete drafts[id];
    localStorageApi.set('savedMessageDrafts', drafts);
}

const setDraft = (id: string, value: RTETypes.Nodes) => {
    let drafts = localStorageApi.get('savedMessageDrafts');
    if (!drafts) {
        drafts = {};
    }

    drafts[id] = value;
    localStorageApi.set('savedMessageDrafts', drafts);
}

export const useSendMessageFormControls = (chatId: string) => {
    const [create] = MessageApi.useMessageCreateMutation();

    const getInitialValue = useCallback(() => {
        return {
            content: (
                getDraft(chatId)
                ?? RTEModules.Utils.createInitialValue()
            ),
            attachments: [],
        } as MessageInputFormValues;
    }, [chatId])

    const handleSubmit = async(
        value: MessageInputFormValues,
        {resetForm}: FormikHelpers<MessageInputFormValues>
    ) => {
        await create({
            chatId,
            content: JSON.stringify(value.content),
            attachments: value.attachments,
        }).then(() => {
            deleteDraft(chatId);
            resetForm({values: getInitialValue()});
        });
    };

    const onRTEValueChangeWrapper = (cb: (value: RTETypes.Nodes) => void) => {
        return (value: RTETypes.Nodes) => {
            setDraft(chatId, value)
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