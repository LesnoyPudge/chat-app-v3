import { ObserverStore } from './ObserverStore';
import { SharedObserver } from './SharedObserver';



const resizeObserverStore = new ObserverStore(ResizeObserver);

export const sharedResizeObserver = new SharedObserver(resizeObserverStore);