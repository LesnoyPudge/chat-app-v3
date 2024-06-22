import { FC, PropsWithChildren } from "react";
import { useChat } from "./hooks";
import { createContextSelectable } from "@lesnoypudge/utils-react";
import { SliceEntityState } from "@types";



type WithMessages = {
    messages: SliceEntityState.Message[];
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