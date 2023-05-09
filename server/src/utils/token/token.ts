import * as jwt from 'jsonwebtoken';
import { IUser } from '@types';
import { getEnv } from '@utils';



const { JWT_ACCESS_KEYWORD, JWT_REFRESH_KEYWORD, REFRESH_TOKEN_DURATION, ACCESS_TOKEN_DURATION } = getEnv();

export const token = {
    generateTokens(payload: Partial<IUser>, isTest = false) {
        return {
            refreshToken: jwt.sign(payload, JWT_REFRESH_KEYWORD, { expiresIn: isTest ? '5m' : REFRESH_TOKEN_DURATION }),
            accessToken: jwt.sign(payload, JWT_ACCESS_KEYWORD, { expiresIn: isTest ? '5m' : ACCESS_TOKEN_DURATION }),
        };
    },

    validateRefreshToken(refreshToken: string): Partial<IUser> | null {
        try {
            const data = jwt.verify(refreshToken, JWT_REFRESH_KEYWORD) as Partial<IUser>;
            return data;
        } catch (error) {
            return null;
        } 
    },

    validateAccessToken(accessToken: string): Partial<IUser> | null {
        try {
            const data = jwt.verify(accessToken, JWT_ACCESS_KEYWORD) as Partial<IUser>;
            return data;
        } catch (error) {
            return null;
        } 
    },
};