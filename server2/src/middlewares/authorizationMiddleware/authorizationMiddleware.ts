import { ApiError } from '@errors';
import { Middleware } from '@types';
import { token } from '@utils';



export const authorizationMiddleware: Middleware = (req, res, next) => {
    const accessToken = req.cookies?.accessToken;
    if (!accessToken) throw ApiError.unauthorized();

    const userData = token.validateAccessToken(accessToken);
    if (!userData) throw ApiError.unauthorized();

    req.auth = {
        id: userData.id,
        accessToken,
    };

    next();
};