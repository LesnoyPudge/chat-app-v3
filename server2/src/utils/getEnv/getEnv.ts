import { Env } from '@shared';



export const getEnv = () => process.env as unknown as NodeJS.ProcessEnv & Env;