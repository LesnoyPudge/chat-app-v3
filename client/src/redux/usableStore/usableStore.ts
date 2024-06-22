import { T } from "@lesnoypudge/types-utils-base/namespace";
import * as Features from "@redux/features";
import { RootState } from "@redux/store";
import { ActionCreatorWithPayload, Slice, SliceCaseReducers, createSlice } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { useConst } from "@lesnoypudge/utils-react";
import { pick, shallowEqual } from "@lesnoypudge/utils";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { Store, createStore } from "./createStore";
import { createCombinedStore } from "./createCombinedStore";



type SomeStoreValue = {
    some: string;
    data: number;
}

const initialState: SomeStoreValue = {
    data: 5,
    some: '',
}

const SomeStore = createStore({
    slice: createSlice({
        name: 'Some',
        initialState: initialState,
        reducers: {
            some: (state, {payload}) => {}
        }
    }),
    selectors: {
        selectSome: (id: string) => {
            return (state) => {}
        }
    }
})

const CombinedStore = createCombinedStore([
    SomeStore,
])

CombinedStore.Some.selectors.selectSome('qwe')

type CombinedStore = typeof CombinedStore;


type ExtractValueFromStore<_Store> = (
    _Store extends Store<infer _Value, any, any, any> 
        ? _Value
        : never
)

type ExtractPayload<_Fn> = (
    _Fn extends ActionCreatorWithPayload<infer _Payload> 
        ? _Payload extends undefined | never | void | unknown
            ? never
            : _Payload
        : never
);

type ExtractMethodsFromStore<_StoreName extends keyof CombinedStore> = {
    [_Key in keyof CombinedStore[_StoreName]['slice']['actions']]: (
        ExtractPayload<
            CombinedStore[_StoreName]['slice']['actions'][_Key]
        > extends never
            ? () => void
            : (payload: (
                ExtractPayload<CombinedStore[_StoreName]['slice']['actions'][_Key]>
            )) => void
    )
}

type StoreStates = {
    [_Key in keyof CombinedStore]: ExtractValueFromStore<CombinedStore[_Key]>;
}

const useReduxSelector: TypedUseSelectorHook<StoreStates> = useSelector;

export const useStore = <
    _Store extends T.ValueOf<CombinedStore>,
    _Methods extends ExtractMethodsFromStore<_Store['name']>,
    _SelectorValue extends ExtractValueFromStore<_Store>,
    _SelectedValue,
>(
    store: _Store,
    selector: (value: _SelectorValue, methods: _Methods) => _SelectedValue,
): _SelectedValue => {
    const { dispatch } = useAppDispatch();
    const methods = useConst(() => {
        const rawMethods = store.slice.actions;
        const keys = Object.keys(rawMethods) as unknown as (
            keyof _Store['slice']['actions']
        )[];
    
        return keys.reduce((acc, cur) => {
            // @ts-expect-error
            acc[cur] = (...args: unknown[]) => {
                // @ts-expect-error
                dispatch(rawMethods[cur](...args))
            }
            return acc;
        }, {} as _Methods);
    })

    const _selector = useConst(() => (value: StoreStates) => {
        return selector(value[store.name] as _SelectorValue, methods);
    })
    
    return useReduxSelector(_selector, shallowEqual);
};


const {
    some,
    data
    // eslint-disable-next-line react-hooks/rules-of-hooks
} = useStore(CombinedStore.Some, (v, m) => ({...v, ...m}))


// const {
//     deaf,
//     toggleMute,
//     refreshAuth,
//     // eslint-disable-next-line react-hooks/rules-of-hooks
// } = useStore(Store.App, (v, m) => pick(
//     {...v, ...m},
//     'toggleMute',
//     'refreshAuth',
//     'deaf',
// ));