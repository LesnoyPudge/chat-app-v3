import Express from 'express';



export const errorHandler = (error: Error, req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    console.log('\n\n');
    console.log('Caught an error');
    console.log('Path: ' + req.path);
    console.log('Name: ' + error.name);
    console.log('Message: ' + error.message);
    console.log('Stack: ' + error.stack);
    console.log('\n\n');
    res.json('Erorr: ' + error.message);
    next();
};