import { useContextProxy } from "@lesnoypudge/utils-react";
import { FC } from "react";
import { ViewportList } from "react-viewport-list";
import { FeedContext } from "../FeedContextProvider";
import { pick } from "@lesnoypudge/utils";
import { FeedItem } from "./components";
import { PropsWithClassName } from "@types";
import { Memo } from "@components";



export const RealFeed = () => {
    const {
        messages,
        indexesShift,
        setViewportIndexes,
        setViewportList,
    } = useContextProxy(FeedContext)

    return (
        <ViewportList
            items={messages}
            initialIndex={messages.length - 1}
            withCache
            overscan={3}
            indexesShift={indexesShift}
            initialPrerender={10}
            axis='y'
            initialAlignToTop={true}
            scrollThreshold={0}
            ref={setViewportList}
            onViewportIndexesChange={setViewportIndexes}
        >
            {({ id }) => (
                <Memo key={id}>
                    <FeedItem id={id}/>
                </Memo>
            )}
        </ViewportList>
    )
}