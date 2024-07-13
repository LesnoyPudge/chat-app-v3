import { RT } from "@lesnoypudge/types-utils-react/namespace";
import { FC } from "react";
import { useFeed } from "./hooks";
import { ScrollableV2 } from "src/dev/WIP/ScrollableV2";
import { ViewportList } from "react-viewport-list";
import { cn } from "@utils";
import { FocusAt } from "@components";
import { Introduction, MessagePlaceholders } from "./components";



const styles = {
    scrollable: 'grow',
}

export const Feed: FC<RT.PropsWithClassName> = ({
    className = ''
}) => {
    const {
        scrollableRef,
        contentRef,
        viewportListRef,
        placeholderWrapperRef,
        list,
        showIntroduction,
        showPlaceholders,
        getTabIndex,
        getIsFocused,
    } = useFeed()

    return (
        <ScrollableV2 
            className={cn(styles.scrollable, className)}
            direction="vertical"
            withOppositeGutter
            innerRef={scrollableRef}
        >
            <div
                role='feed'
                aria-busy
                aria-label='Лента сообщений'
                ref={contentRef} 
                tabIndex={0}
            >
                <If condition={showIntroduction}>
                    <Introduction/>
                </If>

                <If condition={showPlaceholders}>
                    <MessagePlaceholders innerRef={placeholderWrapperRef}/>
                </If>

                <ViewportList
                    viewportRef={scrollableRef}
                    items={list}
                    overscan={3}
                    indexesShift={list.length}
                    axis='y'
                    ref={viewportListRef}
                    initialIndex={list.length - 1}
                    initialPrerender={10}
                    withCache
                >
                    {(item) => (
                        <FocusAt 
                            key={item.id} 
                            focused={getIsFocused(item.id)} 
                            scrollIntoView
                            vertical="center"
                        >
                            {(({focusableRef}) => (
                                <div
                                    ref={focusableRef}
                                    tabIndex={getTabIndex(item.id)}
                                >
                                    <div>{item.id}</div>
                                </div>
                            ))}
                        </FocusAt>
                    )}
                </ViewportList>
            </div>
        </ScrollableV2>
    )
}