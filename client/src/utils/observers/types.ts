


export type ObserverUnion = IntersectionObserver | ResizeObserver;

export type ObserverEntry<O extends ObserverUnion> = O extends IntersectionObserver 
    ? IntersectionObserverEntry
    : ResizeObserverEntry
;

export type ObserverCallback<O extends ObserverUnion> = (entries: ObserverEntry<O>[]) => void;

export type SingleEntryObserverCallback<O extends ObserverUnion> = (entry: ObserverEntry<O>) => void;

export type Observer<O extends ObserverUnion> = {
    new (callback: ObserverCallback<O>): O,
    prototype: O,
};

export type IntersectionObserverListener = SingleEntryObserverCallback<IntersectionObserver>;

export type ResizeObserverListener = SingleEntryObserverCallback<ResizeObserver>;