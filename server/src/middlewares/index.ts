import Express from 'express';
import { app } from '../server';
import { errorHandler } from './errorHandler';




export const middlewares = {
    raw: {
        errorHandler,
        anotherHandler: (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
            console.log('another');
            next();
        },
    },

    init: {
        errorHandler: () => {
            app.use(errorHandler);
            return middlewares.init;
        },
        anotherHandler: () => {
            // app.use(errorHandler);
            console.log('another');
            return middlewares.init;
        },
    },
};

// export const middlewares = () => {
//     const raw = {
//         errorHandler,
//         anotherHandler: () => {
//             return console.log('another');
//         },
//     };

//     const init = {
//         errorHandler: () => {
//             app.use(errorHandler);
//             return init;
//         },
//         anotherHandler: () => {
//             // app.use(errorHandler);
//             console.log('another');
//             return init;
//         },
//     };

//     return {
//         raw,
//         init,
//     };
// };