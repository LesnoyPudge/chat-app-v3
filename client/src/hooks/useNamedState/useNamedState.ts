import { T } from "@lesnoypudge/types-utils-base/namespace";
import { capitalize } from "@shared";
import isCallable from "is-callable";
import { useCallback, useRef, useState, Dispatch, SetStateAction, MutableRefObject } from "react";



type Return<
    _State,
    _Name extends string,
> = T.Simplify<{
    [state in _Name]: _State;
} & {
    [stateRef in `${_Name}Ref`]: MutableRefObject<_State>
} & {
    [setState in `set${ReturnType<typeof capitalize<_Name>>}`]: (
        Dispatch<SetStateAction<_State>>
    )
}>;

export const useNamedState = <
    _State,
    _Name extends string = string,
>(
    name: _Name,
    initialState: _State | (() => _State),
): Return<_State, _Name> => {
    const [value, setValue] = useState(initialState);
    const stateRef = useRef(value);

    const setUniqueValue: typeof setValue = useCallback((newValue) => {
        const state = (
            isCallable(newValue) ? 
                newValue(stateRef.current) 
                : newValue
        )

        if (stateRef.current === state) return;

        stateRef.current = state;
        setValue(state);
    }, [])

    const result = {
        [name]: value,
        [`${name}Ref`]: stateRef,
        [`set${capitalize(name)}`]: setUniqueValue,
    } as Return<_State, _Name>;

    return result;
}