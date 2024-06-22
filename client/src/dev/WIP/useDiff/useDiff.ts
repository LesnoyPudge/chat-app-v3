import { useEffect, useRef } from "react";



export const getDiff = (prev: Record<any, any>, next: Record<any, any>) => {
    const diff = {};
    // @ts-expect-error
    next.reduce((acc, cur) => {
        if (next[cur] !== prev[cur]) {
            acc[cur] = next[cur];
        }
        
        return acc;
    }, {})

    return diff;
}

export const useDiff = (
    log: boolean,
    props: Record<any, any>,
) => {
    const prevPropsRef = useRef<Record<any, any> | null>(null)
    const currentDiffRer = useRef<any>(null)
    
    useEffect(() => {
        if (prevPropsRef.current === null) {
            prevPropsRef.current = props;
            return;
        }
        
        const diff = getDiff(prevPropsRef.current, props);

        if (log) {
            console.log(diff);
        }

        prevPropsRef.current = diff;
    }, [props, log]);

    return currentDiffRer.current;
}