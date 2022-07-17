import Express from 'express';
import { app } from '../server';
import { errorHandler } from './errorHandler';
import { validationHandler } from './validationHandler';
import { authHandler } from './authHandler';



export const middlewares = {
    raw: {
        validationHandler,
        errorHandler,
        authHandler,
    },

    init: {
        errorHandler: () => {
            app.use(errorHandler);
            return middlewares.init;
        },
    },
};