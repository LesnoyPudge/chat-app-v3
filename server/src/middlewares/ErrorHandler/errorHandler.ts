import Express from 'express';
import { ApiError } from '../../utils/ApiError/ApiError';



export const errorHandler = (error: Error, req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    console.log('\n\n');
    console.log('Caught an error');
    console.log('Path: ' + req?.path);
    console.log('Name: ' + error?.name);
    console.log('Message: ' + error?.message);
    console.log('Stack: ' + error?.stack);

    // if (!req || !res) return console.log(error);

    if (error instanceof ApiError) return res.status(error.status).json({ message: error.message });

    return res.status(500).json({ message: 'Непредвиденная ошибка' });
};