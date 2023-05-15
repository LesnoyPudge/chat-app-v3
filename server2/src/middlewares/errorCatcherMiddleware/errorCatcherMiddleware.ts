import { Request, Response, NextFunction } from 'express';



export const errorCatcherMiddleware = <F extends (...args: [
    Request, 
    Response, 
    NextFunction
]) => Promise<void>>(fn: F) => {
    return async(req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).then(() => next()).catch((error) => next(error));
    };
};