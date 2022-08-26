import * as jwt from 'jsonwebtoken';
import { IUser } from '@types';
import { getEnv } from '@utils';



const { JWT_ACCESS_KEYWORD, JWT_REFRESH_KEYWORD, REFRESH_TOKEN_DURATION, ACCESS_TOKEN_DURATION } = getEnv();

export const token = {
    generateTokens(payload: IUser, isTest = false) {
        return {
            refreshToken: jwt.sign(payload, JWT_REFRESH_KEYWORD, { expiresIn: isTest ? '5m' : REFRESH_TOKEN_DURATION }),
            accessToken: jwt.sign(payload, JWT_ACCESS_KEYWORD, { expiresIn: isTest ? '5m' : ACCESS_TOKEN_DURATION }),
        };
    },

    validateRefreshToken(refreshToken: string): Partial<IUser> {
        try {
            return jwt.verify(refreshToken, JWT_REFRESH_KEYWORD) as Partial<IUser>;
        } catch (error) {
            return null;
        } 
    },

    validateAccessToken(accessToken: string): Partial<IUser> {
        try {
            return jwt.verify(accessToken, JWT_ACCESS_KEYWORD) as Partial<IUser>;
        } catch (error) {
            return null;
        } 
    },
};