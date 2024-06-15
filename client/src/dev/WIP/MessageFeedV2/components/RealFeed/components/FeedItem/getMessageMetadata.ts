import { SliceEntityState } from "@types";
import { differenceInMinutes, isSameDay } from "date-fns";



type Props = {
    messages: SliceEntityState.Message[];
    currentMessageIndex: number;
}

export const getMessageMetadata = ({
    currentMessageIndex,
    messages,
}: Props) => {
    const message = messages[currentMessageIndex];

    const previousMessage = (
        currentMessageIndex > 0
            ? messages[currentMessageIndex - 1]
            : null
    );
    
    const isPreviousUserSameAsCurrent = (
        previousMessage 
            ? previousMessage.user === message.user
            : false
    );
    
    const isNewDay = (
        previousMessage
            ? !isSameDay(
                previousMessage.createdAt, 
                message.createdAt,
            )
            : false
    );
    
    const withTimeGap = (
        previousMessage
            ? differenceInMinutes(
                previousMessage.createdAt, 
                message.createdAt,
            ) >= 5
            : false
    );

    const isFirst = currentMessageIndex === 0;

    const isGroupHead = (
        isFirst 
        || isPreviousUserSameAsCurrent 
        || withTimeGap 
        || isNewDay
    );

    const showDayDivider = !isFirst && isNewDay;

    return {
        isGroupHead,
        showDayDivider,
    }
}