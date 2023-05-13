import * as jwt from 'jsonwebtoken';
import { getEnv } from '@utils';



const { JWT_ACCESS_KEYWORD, JWT_REFRESH_KEYWORD, REFRESH_TOKEN_DURATION, ACCESS_TOKEN_DURATION } = getEnv();

export const token = {
    generateTokens(payload: any) {
        return {
            refreshToken: jwt.sign(
                payload, JWT_REFRESH_KEYWORD, 
                { expiresIn: REFRESH_TOKEN_DURATION },
            ),
            accessToken: jwt.sign(
                payload, JWT_ACCESS_KEYWORD, 
                { expiresIn: ACCESS_TOKEN_DURATION },
            ),
        };
    },

    validateRefreshToken(refreshToken: string): any | null {
        try {
            const data = jwt.verify(refreshToken, JWT_REFRESH_KEYWORD);
            return data;
        } catch (error) {
            return null;
        } 
    },

    validateAccessToken(accessToken: string): any | null {
        try {
            const data = jwt.verify(accessToken, JWT_ACCESS_KEYWORD);
            return data;
        } catch (error) {
            return null;
        } 
    },
};