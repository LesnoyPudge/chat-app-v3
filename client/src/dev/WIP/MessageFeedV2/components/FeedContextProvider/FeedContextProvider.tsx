import { FC, PropsWithChildren } from "react";
import { useChat } from "./hooks";
import { SliceEntityState } from "@types";
import { createContextSelectable } from "@lesnoypudge/utils-react";



type WithMessages = {
    messages: SliceEntityState.Message[]
}

type FeedContextProvider = PropsWithChildren & WithMessages;

export const FeedContext = createContextSelectable<
    ReturnType<typeof useChat> & WithMessages
>();

export const FeedContextProvider: FC<FeedContextProvider> = ({
    messages,
    children,
}) => {
    const value = useChat(messages);
    
    return (
        <FeedContext.Provider value={{
            messages,
            ...value
        }}>
            {children}
        </FeedContext.Provider>
    )
}