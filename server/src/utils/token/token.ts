import * as jwt from 'jsonwebtoken';
import { IUser } from '../../types';
import { getEnv } from '../env';



const { JWT_ACCESS_KEYWORD, JWT_REFRESH_KEYWORD } = getEnv();

export const token = {
    generateTokens(payload: IUser) {
        return {
            refreshToken: jwt.sign(payload, JWT_REFRESH_KEYWORD, { expiresIn: '30d' }),
            accessToken: jwt.sign(payload, JWT_ACCESS_KEYWORD, { expiresIn: '15s' }),
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