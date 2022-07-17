import { ErrorMiddlewareType } from '../../types';
import { ApiError } from '../../utils/ApiError/ApiError';



export const errorHandler: ErrorMiddlewareType<any, any, any> = (error, req, res, next) => {
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