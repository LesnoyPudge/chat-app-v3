import { ApiError } from '@errors';
import { NextFunction, Request, Response } from 'express';



export const errorHandlerMiddleware = (error: Partial<ApiError>, req: Request, res: Response, _: NextFunction) => {
    console.log('-'.repeat(10));
    console.log('Caught an error');
    console.log(`Path: ${req.path}`);
    console.log(`Name: ${error.name}`);
    console.log(`Message: ${error.message}`);
    // console.log('Stack: ' + error?.stack);
    console.log('-'.repeat(10));

    if (error.status) {
        return res.status(error.status).json({ message: error.message });
    }

    const internalError = ApiError.internal();

    res.status(internalError.status).json({ message: internalError.message });
};