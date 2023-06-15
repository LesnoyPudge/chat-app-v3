import { AuthorizedMiddleware, Middleware } from '@types';
// import { Request, Response, NextFunction } from 'express';



// export const errorCatcherMiddleware = <F extends (...args: [
//     Request, 
//     Response, 
//     NextFunction
// ]) => Promise<void>>(fn: F) => {
//     return async(req: Request, res: Response, next: NextFunction) => {
//         Promise.resolve(fn(req, res, next)).then(() => next()).catch((error) => next(error));
//     };
// };

export const errorCatcherMiddleware = <F extends AuthorizedMiddleware<any, any>>(fn: F): Middleware => {
    return async(req, res, next) => {
        // @ts-ignore
        Promise.resolve(fn(req, res, next)).then(() => next()).catch((error) => next(error));
    };
};