import { ClientAccessibleEnv } from '@shared';



export const getEnv = () => import.meta.env as unknown as ImportMetaEnv & ClientAccessibleEnv;