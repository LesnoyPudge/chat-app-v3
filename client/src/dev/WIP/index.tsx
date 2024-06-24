import { FC } from "react";
import { MessageFeed } from "./MessageFeed";
import ReactFocusLock from "react-focus-lock";
import { MessageFeedV2 } from "./MessageFeedV2";


export const Main: FC = () => {
    return (
        <ReactFocusLock>
            <div className="h-dvh py-8">
                {/* <Chat/> */}
                {/* <MessageFeed messages={undefined}/> */}
                <MessageFeedV2 chatId="qwe"/>
            </div>
        </ReactFocusLock>
    )
}