import { i18nInit } from '@i18n';
import { containerQueriesPolyfill } from '../components';



export const beforeInit = async() => {
    await Promise.all([
        containerQueriesPolyfill(),
        i18nInit(),
    ]);
};