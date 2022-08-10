import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../../utils/ApiError/ApiError';



interface IError extends Error {
    status?: number;
}

type ErrorMiddlewareType = (
    error: IError, 
    req: Request, 
    res: Response, 
    next: NextFunction,
) => unknown;

export const errorHandler: ErrorMiddlewareType = (error, req, res, next) => {
    console.log('\n\n');
    console.log('Caught an error');
    console.log('Path: ' + req?.path);
    console.log('Name: ' + error?.name);
    console.log('Message: ' + error?.message);
    console.log('Stack: ' + error?.stack);

    // error instanceof ApiError
    if (error.status) return res.status(error.status).json({ message: error.message });

    return res.status(500).json({ message: 'Непредвиденная ошибка' });
};