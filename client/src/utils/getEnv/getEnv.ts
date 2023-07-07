import { ClientAccessibleEnv } from '@shared';



export const getEnv = () => {
    return import.meta.env as unknown as ImportMetaEnv & ClientAccessibleEnv;
};