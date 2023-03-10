import { EncodeFilesResult, noop } from '@utils';
import { useFormikContext } from 'formik';
import { createContext, FC, PropsWithChildren, useRef } from 'react';
import { MessageInputBarFormValues } from '../../MessageInputBar';



type AddListener = (cb: () => void) => void;

export interface AttachmentsContext {
    onAttachmentsOverflow: AddListener;
    onSizeLimitRestriction: AddListener;
    onUnacceptableType: AddListener;
    onFileAdd: (files: EncodeFilesResult) => void;
}

interface Handlers {
    overflow: null | (() => void);
    sizeLimit: null | (() => void);
    type: null | (() => void);
}

const ATTACHMENTS_LIMIT = 9;

export const AttachmentsContext = createContext<AttachmentsContext | undefined>(undefined);

export const AttachmentsContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const { values, setValues } = useFormikContext<MessageInputBarFormValues>();
    const handlersRef = useRef<Handlers>({
        overflow: null,
        sizeLimit: null,
        type: null,
    });

    const onAttachmentsOverflow: AddListener = (cb) => {
        handlersRef.current.overflow = cb;
    };

    const onSizeLimitRestriction: AddListener = (cb) => {
        handlersRef.current.sizeLimit = cb;
    };

    const onUnacceptableType: AddListener = (cb) => {
        handlersRef.current.type = cb;
    };

    const onFileAdd = (files: EncodeFilesResult) => {
        const currentAttachments = values.attachments;
        const noSpace = currentAttachments.length === ATTACHMENTS_LIMIT;
        const notEnoughSpace = currentAttachments.length + files.ok.length > ATTACHMENTS_LIMIT;
        const overSizeLimit = files.bad.some((file) => file.reason === 'size');
        const unacceptableType = files.bad.some((file) => file.reason === 'type');
        const hasAcceptableFiles = !!files.ok.length;

        const triggerOverflow = handlersRef.current.overflow || noop;
        const triggerSizeLimit = handlersRef.current.sizeLimit || noop;
        const triggerUnacceptableType = handlersRef.current.type || noop;

        const setAttachments = () => {
            setValues({
                ...values,
                attachments: [...values.attachments, ...files.ok].slice(0, ATTACHMENTS_LIMIT),
            });
        };

        if (noSpace) return triggerOverflow();

        if (hasAcceptableFiles) setAttachments();
        
        if (notEnoughSpace) return triggerOverflow();
        if (overSizeLimit) return triggerSizeLimit();
        if (unacceptableType) return triggerUnacceptableType();
    };

    const contextValues: AttachmentsContext = {
        onAttachmentsOverflow,
        onSizeLimitRestriction,
        onUnacceptableType,
        onFileAdd,
    };

    return (
        <AttachmentsContext.Provider value={contextValues}>
            {children}
        </AttachmentsContext.Provider>
    );
};