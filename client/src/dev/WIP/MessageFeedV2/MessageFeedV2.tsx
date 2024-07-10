import { PropsWithClassName, SliceEntityState } from "@types";
import { FC, useState } from "react";
import { IMessage } from "@backendTypes";
import { EmojiCode, Scrollable } from "@components";
import { EmptyFeed, FeedContextProvider, FeedPlaceholder, RealFeed, Wrapper } from "./components";
import { useEntitySubscription } from "@hooks";




type MessageFeedV2 = PropsWithClassName & {
    chatId: string;
}
import { ChatMock } from "@utils";
import { useInterval } from "usehooks-ts";
const chatMock = new ChatMock(150, 20);

const initialMessages = chatMock.getLastMessagesChunk();

export const MessageFeedV2: FC<MessageFeedV2> = ({
    className = '',
    chatId,
}) => {
    // const [chat] = useEntitySubscription<SliceEntityState.Chat>(
    //     'Chat', 
    //     [chatId]
    // );
    // const messages = useEntitySubscription<SliceEntityState.Message>(
    //     'Message',
    //     chat.messages,
    // );
    const [messages, setMessages] = useState(initialMessages)

    useInterval(() => {
        const [_, newMessage] = chatMock.addNewMessage()
        setMessages((prev) => {
            return [...prev, newMessage]
        })
    }, 1000)

    const isLoading = !messages;
    const isEmpty = !isLoading && !messages.length;
    const isFilled = !isLoading && !!messages.length;

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