import Express from 'express';



export const errorHandler = (error: any, req: Express.Request, res: Express.Response) => {
    console.log('Caught an error');
    console.log('Path: ' + req.path);
    console.log('Error: ' + error.message);
    console.log('Stack: ' + error.stack);
    res.json('Erorr');
};