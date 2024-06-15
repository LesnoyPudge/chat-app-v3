import { useContextSelectable } from "@lesnoypudge/utils-react";
import { FC } from "react";
import { ViewportList } from "react-viewport-list";
import { FeedContext } from "../FeedContextProvider";
import { pick } from "@lesnoypudge/utils";
import { FeedItem } from "./components";
import { PropsWithClassName } from "@types";



export const RealFeed: FC<PropsWithClassName> = ({
    className = ''
}) => {
    const {
        messages,
        indexesShift,
        setViewportIndexes,
        setViewportList,
    } = useContextSelectable(FeedContext, (v) => pick(
        v, 
        'messages',
        'indexesShift',
        'setViewportList',
        'setViewportIndexes'
    ))

    return (
        <div className={className}>
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
                    <FeedItem id={id} key={id}/>
                )}
            </ViewportList>
        </div>
    )
}