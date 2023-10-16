import { webVitals, offlineWorker } from '../components';



export const afterInit = () => {
    webVitals();
    offlineWorker();
};