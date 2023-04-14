import { useSharedIntersectionObserver } from '@hooks';
import { RefObject } from 'react';
import { chatMock } from '../../Chat2';



interface UseChatLoadProps {
    placeholderElement: HTMLElement | null,
    firstMessageCreationDateRef: RefObject<number>
}

export const useChatLoad = ({
    firstMessageCreationDateRef,
    placeholderElement,
}: UseChatLoadProps) => {
    useSharedIntersectionObserver(placeholderElement, ({ isIntersecting }) => {
        if (!isIntersecting) return;
        if (!firstMessageCreationDateRef.current) return;

        const earlierMessages = chatMock.getMessagesBeforeTimestamp(firstMessageCreationDateRef.current);
        console.log('fetch messages before', firstMessageCreationDateRef.current);
        console.log('fetched', earlierMessages.length);
    });
};