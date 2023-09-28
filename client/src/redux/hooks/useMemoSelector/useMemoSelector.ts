import { RootState } from '@redux/store';
import { AnyArray } from 'ts-essentials';
import { useAppSelector } from '@redux/hooks';
import { useCallback } from 'react';
import { memoize } from 'proxy-memoize';



const cacheSize = { size: 50 };

export const useMemoSelector = <T,>(
    fn: (state: RootState) => T,
    deps: AnyArray = [],
) => {
    return useAppSelector(
        // eslint-disable-next-line react-hooks/exhaustive-deps
        useCallback(memoize(fn, cacheSize), deps),
    );
};