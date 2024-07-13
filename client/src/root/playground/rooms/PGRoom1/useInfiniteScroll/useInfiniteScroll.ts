import { derivedPromise, sleep } from "@lesnoypudge/utils";
import { HelperApi, MessageApi, MessageSelectors } from "@redux/features";
import { useMemoSelectorV2 } from "@redux/hooks";
import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from "react";
import { useNamedState } from "../useNamedState/useNamedState";
import { usePromise, useSharedIntersectionObserver } from "@hooks";



export const useInfiniteScroll = (
    scrollableRef: RefObject<HTMLElement>,
    placeholderContainerRef: RefObject<HTMLElement>,
) => {
    const {
        showIntroduction,
        setShowIntroduction,
    } = useNamedState('showIntroduction', false);
    const {
        showPlaceholders,
        setShowPlaceholders,
    } = useNamedState('showPlaceholders', true);
    
    const [list, setList] = useState<{id: string, data: string}[]>([]);
    const {
        isLoading,
        setIsLoading,
    } = useNamedState('isLoading', false);

    const generateListChunk = () => {
        console.log('generateChunk')
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

    // useEffect(() => {
    //     const controls = fetchItems()
    //     return () => {
    //         controls?.controls.reject()
    //     }
    // }, [])
        
    useSharedIntersectionObserver(placeholderContainerRef, ({
        isIntersecting,
    }) => {
        if (!isIntersecting) return;
        if (isLoading) return;
        console.log('intersecting')
        fetchItems();
    });

    return {
        showIntroduction,
        showPlaceholders,
        list,
    }
}