// eslint-disable-next-line import/no-unresolved
import { registerSW } from 'virtual:pwa-register';



export const offlineWorker = () => {
    const updateSW = registerSW({
        onNeedRefresh: () => updateSW(true),
    });
};