import { MiddlewareType } from '@types';



export const paramsToBodyMiddleware: MiddlewareType<never, never, never> = (req, res, next) => {
    req.body = Object.assign(req.body, req.params);
    next();
};