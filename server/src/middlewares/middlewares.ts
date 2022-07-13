import Express from 'express';
import { app } from '../server';
import { errorHandler } from './errorHandler';
import { validationHandler } from './validationHandler';



export const middlewares = {
    raw: {
        validationHandler,
    },

    init: {
        errorHandler: () => {
            app.use(errorHandler);
            return middlewares.init;
        },
    },
};