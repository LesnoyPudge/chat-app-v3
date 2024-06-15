import { EmojiCode } from "@components";
import { useCallback, useRef, useState } from "react";
import { getRandomNumber } from "@shared";



export const useEmojiSwitcher = (emojiCodeList: EmojiCode[]) => {
    const prevIndexRef = useRef<number | null>(null);
    
    const getEmojiCode = useCallback(() => {
        const length = emojiCodeList.length;
        const rangeEnd = length - 1;
        let index = getRandomNumber(0, rangeEnd);

        if (prevIndexRef.current !== null) {
            while (index === prevIndexRef.current) {
                index = getRandomNumber(0, rangeEnd);
            }
        }

        prevIndexRef.current = index;
    
        return emojiCodeList[index];
    }, [emojiCodeList]);

    const [emojiCode, setEmojiCode] = useState(() => getEmojiCode());
    
    const changeEmoji = useCallback(() => {
        setEmojiCode(getEmojiCode());
    }, [getEmojiCode]);

    return {
        emojiCode,
        changeEmoji,
    }
}