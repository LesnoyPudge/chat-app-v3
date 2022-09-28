import { useIsFirstRender } from '@hooks';
import { useEffect, DependencyList, EffectCallback } from 'react';



export const useUpdateEffect = (effect: EffectCallback, deps?: DependencyList) => {
    const isFirstRender = useIsFirstRender();

    useEffect(() => {
        if (!isFirstRender) return effect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
};