import * as uuid from 'uuid';
import { getEnv } from '../getEnv';



const { CUSTOM_SERVER_URL, CUSTOM_API_V1_URL } = getEnv();

export const createActivationLink = () => {
    const code = uuid.v4();
    const channelId = '213';
    const link = CUSTOM_SERVER_URL + CUSTOM_API_V1_URL + `/channel/${channelId}/invitation/${code}`; 

    return link;
};