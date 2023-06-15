import { Middleware } from '@types';



export const paramsToBodyMiddleware: Middleware<object> = (req, _, next) => {
    req.body = Object.assign(req.body, req.params);
    next();
};