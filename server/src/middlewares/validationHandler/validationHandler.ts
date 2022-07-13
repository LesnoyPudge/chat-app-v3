import Express from 'express';
import { ValidationChain, validationResult } from 'express-validator';
import { Request } from 'express-validator/src/base';
import { ResultWithContext } from 'express-validator/src/chain';
import { ApiError } from '../../utils';



// export const validationHandler = (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
//     const result = validationResult(req).array();

//     if (!result.length) return next();

//     console.log(result);
//     ApiError.badRequest('Validation failed: ' + result[0].msg);
// };

// createUser: () => ValidationChain[] & {
//     run: (req: Request) => Promise<ResultWithContext[]>;

type ValidatorType = () => ValidationChain[] & {
    run: (req: Request) => Promise<ResultWithContext[]>;
}

export const validationHandler = (validator: ValidatorType) => (
    req: Request, 
    res: Express.Response, 
    next: Express.NextFunction,
) => {
    validator().run(req)
        .then(() => {
            const result = validationResult(req).array();

            if (!result.length) return next();
    
            console.log(result);
            ApiError.badRequest('Validation failed: ' + result[0].msg);
        })
        .catch((error) => next(error));
};