import { useSharedIntersectionObserver } from '@hooks';
import { RefObject, useState } from 'react';
import { chatMock } from '../../Chat2';



interface UseChatLoadProps {
    placeholderElement: HTMLElement | null,
    firstMessageCreationDateRef: RefObject<number>
}

export const useChatLoad = ({
    firstMessageCreationDateRef,
    placeholderElement,
}: UseChatLoadProps) => {
    const [isAtStart, setIsAtStart] = useState(false);
    
    useSharedIntersectionObserver(placeholderElement, ({ isIntersecting }) => {
        if (!isIntersecting) return;
        if (!firstMessageCreationDateRef.current) return;
        

        const earlierMessages = chatMock.getMessagesBeforeTimestamp(firstMessageCreationDateRef.current);
        console.log('fetch messages before', firstMessageCreationDateRef.current);
        console.log('fetched', earlierMessages.length);
        setIsAtStart(true);
    });

    return {
        isAtStart,
    };
};