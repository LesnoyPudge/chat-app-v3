import { T } from "@lesnoypudge/types-utils-base/namespace";
import { Store } from "./createStore";



export const createCombinedStore = <
    _Store extends Store<any, any, any, any>,
>(stores: _Store[]): T.Simplify<Record<_Store['name'], _Store>> => {
    return stores.reduce<any>((acc, cur) => {
        acc[cur.name] = cur;
        return acc;
    }, {})
}