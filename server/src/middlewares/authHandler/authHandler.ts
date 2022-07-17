import { UserService } from '../../services';
import { AuthorizedMiddlewareType } from '../../types';
import { ApiError, token } from '../../utils';



export const authHandler: AuthorizedMiddlewareType<any, any, any> = async(req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw ApiError.unauthorized();

    const accessToken = authHeader.split(' ')[1];
    if (!accessToken) throw ApiError.unauthorized();

    const user = token.validateAccessToken(accessToken);
    if (!user) throw ApiError.unauthorized();

    req.auth.user = user;
    next();
};