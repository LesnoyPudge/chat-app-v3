import Express from 'express';
import { app } from '../server';
import { errorHandler } from './ErrorHandler/errorHandler';




export const middlewares = {
    raw: {
        errorHandler,
    },

    init: {
        errorHandler: () => {
            app.use(errorHandler);
            return middlewares.init;
        },
    },
};