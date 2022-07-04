import { Application } from 'express';
import { SomeRouter } from './SomeRouter';



const routesInit = (app: Application) => {
    app.use('/some', SomeRouter);
};

export default routesInit;