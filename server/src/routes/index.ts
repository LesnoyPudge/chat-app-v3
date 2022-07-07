import { Application } from 'express';
import { SomeRouter } from './SomeRouter';



export const routesInit = (app: Application) => {
    app.use('/some', SomeRouter);
};