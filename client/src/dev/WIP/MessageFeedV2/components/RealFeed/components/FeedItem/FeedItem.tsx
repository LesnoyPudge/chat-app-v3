import { useContextSelectable } from "@lesnoypudge/utils-react";
import { FC, useRef } from "react";
import { FeedContext } from "../../../FeedContextProvider";
import { pick } from "@lesnoypudge/utils";
import { cn } from "@utils";
import { getMessageMetadata } from "./getMessageMetadata";
import { Message } from "@components";
import { useMemoSelector } from "@redux/hooks";
import { AppSelectors, AppSlice } from "@redux/features";



type FeedItem = {
    id: string;
}

const styles = {
    message: 'pr-12 py-1',
    messageGroupHead: 'message-group-head',
};

export const FeedItem: FC<FeedItem> = ({id}) => {
    const {settings: {messageDisplayMode}} = useMemoSelector(AppSelectors.selectMe, []);
    const {
        messages,
        setFocusedId,
        getTabIndex,
    } = useContextSelectable(FeedContext, (v) => pick(
        v,
        'setFocusedId',
        'messages',
        'getTabIndex'
    ))
    
    const currentMessageIndex = messages.findIndex((item) => item.id === id);
    const message = messages[currentMessageIndex];

    const messageWrapperRef = useRef<HTMLDivElement | null>(null);
    const messageRef = useRef<HTMLElement | null>(null);

    const {
        isGroupHead,
        showDayDivider,
    } = getMessageMetadata({currentMessageIndex, messages})

    const handleItemClick = () => setFocusedId(message.id);

    return (
        <div 
            aria-hidden
            ref={messageWrapperRef} 
        >
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