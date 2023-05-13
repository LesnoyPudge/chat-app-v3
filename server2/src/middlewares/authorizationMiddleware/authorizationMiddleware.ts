import { ApiError } from '@errors';
import { Middleware } from '@types';
import { token } from '@utils';



export const authorizationMiddleware: Middleware<void, void> = (req, res, next) => {
    const accessToken = req.cookies?.accessToken;
    if (!accessToken) throw ApiError.unauthorized();

    const user = token.validateAccessToken(accessToken);
    if (!user) throw ApiError.unauthorized();

    req.user = user;

    next();
};