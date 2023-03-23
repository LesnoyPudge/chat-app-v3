import { Observer, ObserverEntry, ObserverUnion, SingleEntryObserverCallback } from './types';



export class ObserverStore<O extends ObserverUnion> {
    private observer: O;
    private listeners: Map<Element, SingleEntryObserverCallback<O>[]>;

    constructor(observerConstructor: Observer<O>) {
        const observerCallback = (entries: ObserverEntry<O>[]) => {
            for (const entry of entries) {
                const listeners = this.listeners.get(entry.target);
                if (!listeners) return;
                
                for (const listener of listeners) {
                    listener(entry);
                }
            }
        };

        this.listeners = new Map();
        this.observer = new observerConstructor(observerCallback);
    }

    addListener(target: Element, listener: SingleEntryObserverCallback<O>) {
        const newListeners = [...this.listeners.get(target) || [], listener];

        this.listeners.set(target, newListeners);
        this.observer.observe(target);
    }

    removeListener(target: Element, listener: SingleEntryObserverCallback<O>) {
        const listeners = this.listeners.get(target);
        const filteredListeners = listeners?.filter((item) => item !== listener);

        if (!listeners?.length || !filteredListeners?.length) {
            this.listeners.delete(target);
            this.observer.unobserve(target);
            return;
        }
        
        this.listeners.set(target, filteredListeners);
    }
}