import { StrictOmit, ValueOf } from "ts-essentials";
import { Entities, SUBSCRIBABLE_ENTITIES } from "@shared";
// import { defaultSelector } from "@lesnoypudge/utils-react";
import { useSelector } from "react-redux";
import { useAppSelector } from "../useAppSelector";
import { RootState } from "@redux/store";
import { MessageSelectors } from "@redux/features";
import { shallowEqual } from "@lesnoypudge/utils";
import { useRef } from "react";




type SliceStates = StrictOmit<RootState, 'api'>;

// export const useMemoSelectorV2 = <
//     _EntityName extends keyof SliceStates,
//     // _EntityName extends ValueOf<typeof SUBSCRIBABLE_ENTITIES>,
//     _Value extends SliceStates[_EntityName],
//     _SelectedValue = _Value
// >(
//     // entityName: _EntityName,
//     // selector: (v: _Value) => _SelectedValue = defaultSelector,
// ): _SelectedValue => {
    
//     // const selected = useAppSelector((state) => selector(state[entityName]))

//     return {} as any
// }



export const useMemoSelectorV2 = <_SelectedValue,>(
    selector: (state: RootState) => _SelectedValue,
) => {
    return useAppSelector(
        selector,
        shallowEqual,
    );
};
// export const useMemoSelectorV2 = () => {
//     return useAppSelector(, shallowEqual)
// }

// const qwe = useMemoSelectorV2('message', (v) => {
//     MessageSelectors.selectById('qwe')()
// })