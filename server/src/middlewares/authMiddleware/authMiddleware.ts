import { AuthorizedMiddlewareType } from '@types';
import { ApiError, token } from '@utils';



export const authMiddleware: AuthorizedMiddlewareType<never, never, never> = async(req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) throw ApiError.unauthorized();

        const accessToken = authHeader.split(' ')[1];
        if (!accessToken) throw ApiError.unauthorized();

        const user = token.validateAccessToken(accessToken);
        if (!user) throw ApiError.unauthorized();

        req.auth = {
            user,
        };
        
        next();
    } catch (error) {
        next(error);
    }
};