import { useContextSelectable } from "@lesnoypudge/utils-react";
import { FC, useEffect, useRef } from "react";
import { FeedContext } from "../../../FeedContextProvider";
import { pick } from "@lesnoypudge/utils";
import { cn } from "@utils";
import { getMessageMetadata } from "./getMessageMetadata";
import { Message } from "@components";
import { useMemoSelector } from "@redux/hooks";
import { AppSelectors, MessageSelectors } from "@redux/features";
import { DayDivider } from "./components";
import { useMessageLayout } from "./hooks";



type FeedItem = {
    id: string;
}

const styles = {
    message: 'pr-12 py-1',
    messageGroupHead: 'message-group-head',
};

export const FeedItem: FC<FeedItem> = ({id}) => {
    const {
        settings: {messageDisplayMode}
    } = useMemoSelector(AppSelectors.selectMe, []);

    const {
        messages,
        setFocusedId,
        getTabIndex,
        getIsFocused,
    } = useContextSelectable(FeedContext, (v) => pick(
        v,
        'setFocusedId',
        'messages',
        'getTabIndex',
        'getIsFocused'
    ))
    
    const {messageRef, messageWrapperRef} = useMessageLayout({
        id,
        isFocused: getIsFocused(id)
    })
    
    const currentMessageIndex = messages.findIndex((item) => item.id === id);
    const message = messages[currentMessageIndex];

    
    const {
        isGroupHead,
        showDayDivider,
    } = getMessageMetadata({currentMessageIndex, messages})

    const handleItemClick = () => setFocusedId(message.id);
    
    return (
        <div ref={messageWrapperRef}>
            <If condition={showDayDivider}>
                <DayDivider time={message.createdAt}/>
            </If>
                    
            <div 
                className={cn({
                    [styles.messageGroupHead]: isGroupHead,
                })}
                onClick={handleItemClick}
            >
                <Message
                    className={styles.message}
                    innerRef={messageRef}
                    message={message}
                    displayMode={messageDisplayMode}
                    isGroupHead={isGroupHead}
                    tabIndex={getTabIndex(message.id)}

                />
            </div>
        </div>
    );
}