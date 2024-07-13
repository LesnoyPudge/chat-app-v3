import { derivedPromise, sleep } from "@lesnoypudge/utils";
import { RefObject, useContext, useEffect, useState } from "react";
import { useNamedState, useSharedIntersectionObserver } from "@hooks";
import { LoadedEntityContext } from "@components";



export const useInfiniteScroll = (
    scrollableRef: RefObject<HTMLElement>,
    placeholderContainerRef: RefObject<HTMLElement>,
) => {
    const [chat] = useContext(LoadedEntityContext.Chat);
    const [list, setList] = useState<{id: string, data: string}[]>([]);
    const {
        showIntroduction,
        setShowIntroduction,
    } = useNamedState('showIntroduction', false);
    const {
        showPlaceholders,
        setShowPlaceholders,
    } = useNamedState('showPlaceholders', true);
    const {
        isLoading,
        setIsLoading,
    } = useNamedState('isLoading', false);

    const generateListChunk = () => {
        let chunk = [];
        const left = 200 - list.length;

        for (let i = 0; i < 50; i++) {
            const index = left - i;
            chunk.push({id: String(index), data: `item-${index}`})
        }

        return chunk.reverse();
    }

    
    const fetchItems = () => {
        if (isLoading) return;

        setIsLoading(true)

        const [promise, controls] = derivedPromise(async() => {
            await sleep(2000)
            controls.resolve()
        })
        
        promise.then(() => {
            setList(prev => [...generateListChunk(), ...prev])
            setIsLoading(false)
            console.log(list.length)
        }).catch(() => {
            setIsLoading(false)
        })

        return {controls}
    }

    useEffect(() => {
        if (200 - list.length === 0) {
            setShowPlaceholders(false)
            setShowIntroduction(true)
        }
    }, [list.length])
        
    useSharedIntersectionObserver(placeholderContainerRef, ({
        isIntersecting,
    }) => {
        if (!isIntersecting) return;
        if (isLoading) return;

        fetchItems();
    });

    return {
        showIntroduction,
        showPlaceholders,
        list,
    }
}