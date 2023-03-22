import useResizeObserver from '@react-hook/resize-observer';






type ObserverCallback<O extends ObserverUnion> = O extends IntersectionObserver 
    ? (entries: IntersectionObserverEntry[]) => void
    : (entries: ResizeObserverEntry[]) => void
;

type ObserverUnion = IntersectionObserver | ResizeObserver;

type SingleEntryCallback<O extends ObserverUnion> = (
    entry: O extends IntersectionObserver 
    ? IntersectionObserverEntry
    : ResizeObserverEntry,
    ) => void
;

type ObserverEntry<O extends ObserverUnion> = O extends IntersectionObserver 
    ? IntersectionObserverEntry
    : ResizeObserverEntry
;

class ObserverStore<O extends ObserverUnion> {
    private observer: O;
    private callbacks: Map<Element, SingleEntryCallback<O>[]>;

    constructor(observerConstructor: Observer<O>) {
        const cb = <T extends IntersectionObserverEntry | ResizeObserverEntry>(entries: T[]) => {
            for (const entry of entries) {
                const callbacks = this.callbacks.get(entry.target);
                if (!callbacks) return;
                
                for (const callback of callbacks) {
                    callback(entry as never);
                }
            }
        };

        this.callbacks = new Map();
        this.observer = new observerConstructor(cb) as O;
    }

    // create(observer: O, callbacks: Map<Element, SingleEntryCallback<O>>) {
    //     if (this.observer && this.callbacks) return {
    //         observer: this.observer,
    //         callbacks: this.callbacks,
    //     };

        
    //     this.observer = observer;
    //     this.callbacks = callbacks;

    //     return {
    //         observer: this.observer,
    //         callbacks: this.callbacks,
    //     };
    // }

    get() {
        return {
            observer: this.observer,
            callbacks: this.callbacks,
        };
    }
}



type Observer<O extends ObserverUnion> = O extends IntersectionObserver 
    // ? {
    //     new (callback: IntersectionObserverCallback): IntersectionObserver,
    //     prototype: IntersectionObserver,
    // }
    // : {
    //     new (callback: ResizeObserverCallback): ResizeObserver,
    //     prototype: ResizeObserver,
    // }
    ? typeof IntersectionObserver 
    : typeof ResizeObserver
;

export class SharedObserver<O extends ObserverUnion> {
    // private observer: O;
    // private callbacks: Map<Element, SingleEntryCallback<O>>;
    
    constructor(observerConstructor: Observer<O>, store: ObserverStore<O>) {
        const {
            observer,
            callbacks,
        } = store.get();

        if (observer && callbacks) {
            // this.observer = observer;
            // this.callbacks = callbacks;
            return;
        }

        const observerCallback = (entries: ObserverEntry<O>[]) => {
            for (const entry of entries) {
                // const callback = this.callbacks.get(entry.target);
                // if (!callback) return;
                
                // callback(entry);
            }
        };
        
        // const createdStore = store.create(
        //     // new observerConstructor(observerCallback),
        //     new Map(),
        // );

        // this.observer = createdStore.observer;
        // this.callbacks = createdStore.callbacks;
    }
}

// export class SingleResizeObserver {
//     private observer: ResizeObserver;
//     private callbacks: Map<Element, SingleEntryCallback<ResizeObserver>>;

//     constructor() {
//         const {
//             observer,
//             callbacks,
//         } = resizeObserverStore.get();

//         if (observer && callbacks) {
//             this.observer = observer;
//             // this.callbacks = callbacks;
//             return;
//         }

//         const observerCallback: ResizeObserverCallback = (entries) => {
//             for (const entry of entries) {
//                 const callback = this.callbacks.get(entry.target);
//                 if (!callback) return;
                
//                 callback(entry);
//             }
//         };
        
//         const store = resizeObserverStore.create(
//             new ResizeObserver(observerCallback),
//             new Map(),
//         );

//         this.observer = store.observer;
//         this.callbacks = store.callbacks;
//     }

//     observe(target: Element, callback: SingleEntryCallback<ResizeObserver>) {
//         if (this.callbacks.has(target)) {
//             // this.callbacks.delete(target);
//         }
        
//         this.observer?.observe(target);
//         this.callbacks.set(target, callback);
//     }

//     unobserve(target: Element) {
//         this.observer?.unobserve(target);
//         this.callbacks.delete(target);
//     }
// }



class SharedObserverV2<O extends ObserverUnion> {
    private observer: O;
    private callbacks: Map<Element, SingleEntryCallback<O>[]>;
    
    constructor(store: ObserverStore<O>) {
        const { observer, callbacks } = store.get();
        
        this.observer = observer;
        this.callbacks = callbacks;
    }

    observe(target: Element, callback: SingleEntryCallback<ResizeObserver>) {
        this.callbacks.set(target, [...this.callbacks.get(target) || [], callback]);
        this.observer.observe(target);
        console.log(this.callbacks);
    }

    unobserve(target: Element, callback: SingleEntryCallback<ResizeObserver>) {
        const callbacks = this.callbacks.get(target);
        this.callbacks.set(target, callbacks?.filter((item) => item === callback) || []);

        if (!this.callbacks.get(target)?.length) {
            this.callbacks.delete(target);
            this.observer.unobserve(target);
        }
    }
}

const resizeObserverStore = new ObserverStore<ResizeObserver>(ResizeObserver);

export const sharedResizeObserver = new SharedObserverV2(resizeObserverStore);