import { containerQueriesPolyfill } from '../components';



export const beforeInit = async() => {
    await containerQueriesPolyfill();
};