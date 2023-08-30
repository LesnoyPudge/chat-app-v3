import { Endpoints } from '@shared';
import { getEnv } from '@utils';



const { CUSTOM_SERVER_URL } = getEnv();

export const getReadImagePath = <T extends string | undefined | null>(
    id: T,
): T => {
    if (!id) return id as T;

    return `${CUSTOM_SERVER_URL}${Endpoints.V1.File.Read.Path}/${id}` as T;
};