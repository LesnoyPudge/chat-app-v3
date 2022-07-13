import Express from 'express';



// export const controllerContainer = <F extends (...args: any) => void>(fn: F) => {
//     return (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
//         Promise.resolve(fn(req, res, next)).catch((error) => next(error));
//     };
// };



export const controllerContainer = <F extends (...args: any) => any>(fn: F) => {
    return async(req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
        try {
            await fn(req, res, next);
        } catch(error) {
            next(error);
        }
    };
};