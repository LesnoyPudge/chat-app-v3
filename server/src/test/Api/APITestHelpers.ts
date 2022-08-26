import { IAuthResponse } from '@types';
import { getRandomString } from '@utils';
import fetch from 'node-fetch';



const { getUUID } = getRandomString;

export const userMockData = {
    NOT_AN_ID: 'not_an_id',
    FAKE_USER_ID: '6307e78ec2cc2f33a2ea195c',

    USER_1: {
        ACCESS_TOKEN: '',
        REFRESH_TOKEN: '',
        ID: '',
    },
    
    USER_2: {
        ACCESS_TOKEN: '',
        REFRESH_TOKEN: '',
        ID: '',
    },
};

export const createUser = async() => {
    const response = await fetch(
        'http://localhost:5000/api/v1/user/registration', 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                login: getUUID(),
                username: getUUID(),
                password: getUUID(),
            }),
        },
    ).then((res) => res.json()) as unknown as IAuthResponse;

    return {
        ID: response.user.id,
        ACCESS_TOKEN: response.accessToken,
        REFRESH_TOKEN: response.refreshToken,
    };
};

export const deleteUser = async(accessToken: string) => {
    return await fetch(
        'http://localhost:5000/api/v1/user/delete', 
        {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${accessToken}`,
            },
        },
    );
};

export const getBearerString = (accessToken: string) => {
    return `Bearer ${accessToken}`;
};