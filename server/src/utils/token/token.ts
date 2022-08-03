import * as jwt from 'jsonwebtoken';
import { IUser } from '@types';
import { getEnv } from '@utils';



const { JWT_ACCESS_KEYWORD, JWT_REFRESH_KEYWORD, REFRESH_TOKEN_DURATION, ACCESS_TOKEN_DURATION } = getEnv();

export const token = {
    generateTokens(payload: IUser) {
        return {
            refreshToken: jwt.sign(payload, JWT_REFRESH_KEYWORD, { expiresIn: REFRESH_TOKEN_DURATION }),
            accessToken: jwt.sign(payload, JWT_ACCESS_KEYWORD, { expiresIn: ACCESS_TOKEN_DURATION }),
        };
    },
    validateRefreshToken(refreshToken: string) {
        try {
            const userData = jwt.verify(refreshToken, JWT_REFRESH_KEYWORD) as IUser;
            return userData;
        } catch (error) {
            return null;
        } 
    },
    validateAccessToken(accessToken: string) {
        try {
            const userData = jwt.verify(accessToken, JWT_ACCESS_KEYWORD) as IUser;
            return userData;
        } catch (error) {
            return null;
        } 
    },
};