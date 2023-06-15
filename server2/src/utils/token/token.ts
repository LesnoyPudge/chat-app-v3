import * as jwt from 'jsonwebtoken';
import { getEnv } from '@utils';
import { Entities, Id } from '@shared';



const { JWT_ACCESS_KEYWORD, JWT_REFRESH_KEYWORD, REFRESH_TOKEN_DURATION, ACCESS_TOKEN_DURATION } = getEnv();

export const token = {
    generateTokens(payload: Entities.User.Token) {
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

    validateRefreshToken(refreshToken: string) {
        try {
            const data = jwt.verify(refreshToken, JWT_REFRESH_KEYWORD) as Entities.User.Token;
            return data;
        } catch (error) {
            return null;
        } 
    },

    validateAccessToken(accessToken: string) {
        try {
            const data = jwt.verify(accessToken, JWT_ACCESS_KEYWORD) as Entities.User.Token;
            return data;
        } catch (error) {
            return null;
        } 
    },
};