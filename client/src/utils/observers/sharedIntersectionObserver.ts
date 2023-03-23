import { ObserverStore } from './ObserverStore';
import { SharedObserver } from './SharedObserver';



const intersectionObserverStore = new ObserverStore(IntersectionObserver);

export const sharedIntersectionObserver = new SharedObserver(intersectionObserverStore);