import { ObserverStore } from './ObserverStore';
import { ObserverUnion, SingleEntryObserverCallback } from './types';



// export class SharedObserver<O extends ObserverUnion> {
//     private observer: O;
//     private callbacks: Map<Element, SingleEntryObserverCallback<O>[]>;
    
//     constructor(store: ObserverStore<O>) {
//         const { observer, callbacks } = store.get();
        
//         this.observer = observer;
//         this.callbacks = callbacks;
//     }

//     observe(target: Element, callback: SingleEntryObserverCallback<ResizeObserver>) {
//         const newCallbacks = [...this.callbacks.get(target) || [], callback];

//         this.callbacks.set(target, newCallbacks);
//         this.observer.observe(target);
//     }

//     unobserve(target: Element, callback: SingleEntryObserverCallback<ResizeObserver>) {
//         const callbacks = this.callbacks.get(target);
//         const filteredCallbacks = callbacks?.filter((item) => item !== callback);

//         if (!callbacks || !callbacks.length || !filteredCallbacks?.length) {
//             this.callbacks.delete(target);
//             this.observer.unobserve(target);
//             return;
//         }
        
//         this.callbacks.set(target, filteredCallbacks);
//     }
// }

export class SharedObserver<O extends ObserverUnion> {
    private store: ObserverStore<O>;
    
    constructor(store: ObserverStore<O>) {
        this.store = store;
    }

    observe(target: Element, listener: SingleEntryObserverCallback<O>) {
        this.store.addListener(target, listener);
    }

    unobserve(target: Element, listener: SingleEntryObserverCallback<O>) {
        this.store.removeListener(target, listener);
    }
}