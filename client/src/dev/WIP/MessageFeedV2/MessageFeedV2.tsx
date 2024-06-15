import { PropsWithClassName, SliceEntityState } from "@types";
import { FC } from "react";
import { IMessage } from "@backendTypes";
import { EmojiCode, Scrollable } from "@components";
import { EmptyFeed, FeedContextProvider, FeedPlaceholder, RealFeed, Wrapper } from "./components";
import { useEntitySubscription } from "@hooks";



type MessageFeedV2 = PropsWithClassName & {
    chatId: string;
}

export const MessageFeedV2: FC<MessageFeedV2> = ({
    className = '',
    chatId,
}) => {
    const [chat] = useEntitySubscription<SliceEntityState.Chat>(
        'Chat', 
        [chatId]
    );
    const messages = useEntitySubscription<SliceEntityState.Message>(
        'Message',
        chat.messages,
    );
    const isLoading = !messages;
    const isEmpty = !isLoading && !!messages.length;
    const isFilled = !isEmpty;

    return (
        <Wrapper className={className}>
            <If condition={isLoading}>
                <FeedPlaceholder/>
            </If>

            <If condition={isEmpty}>
                <EmptyFeed/>
            </If>

            <If condition={isFilled}>
                <FeedContextProvider messages={messages}>
                    <RealFeed/>            
                </FeedContextProvider>
            </If>
        </Wrapper>
    )
}