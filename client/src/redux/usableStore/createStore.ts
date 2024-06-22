import { T } from '@lesnoypudge/types-utils-base/namespace';
import { Slice, SliceCaseReducers } from '@reduxjs/toolkit';



type Selectors<_State> = Record<
    `select${string}`,
    (...props: never[]) => (state: _State) => unknown
>;

export type Store<
    _State extends T.UnknownRecord,
    _Name extends string,
    _Reducers extends SliceCaseReducers<_State>,
    _Selectors extends Selectors<_State> | undefined,
> = {
    name: _Name;
    slice: Slice<_State, _Reducers, _Name>;
    selectors: T.IsEqual<
        NonNullable<_Selectors>, 
        _Selectors
    > extends true ? NonNullable<_Selectors> : undefined;
};

export const createStore = <
    _State extends T.UnknownRecord,
    _Name extends string,
    _Reducers extends SliceCaseReducers<_State>,
    _Selectors extends Selectors<_State> | undefined,
>(
    setup: {
        slice: Slice<_State, _Reducers, _Name>,
        selectors?: _Selectors,
    }
): Store<_State, _Name, _Reducers, _Selectors> => {
    return {
        slice: setup.slice,
        name: setup.slice.name,
        // @ts-expect-error
        selectors: setup.selectors,
    }
};


