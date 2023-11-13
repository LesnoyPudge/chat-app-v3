import { getEnv } from '@utils';



const { CUSTOM_NODE_ENV } = getEnv();

export const isDev = () => CUSTOM_NODE_ENV === 'development';