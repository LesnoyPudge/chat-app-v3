import { Request } from 'express';
import { ValidationChain, validationResult } from 'express-validator';
// import { Request } from 'express-validator/src/base';
import { ResultWithContext } from 'express-validator/src/chain';
import { MiddlewareType } from '../../types';
import { ApiError } from '../../utils';



type ValidatorType = () => ValidationChain[] & {
    run: (req: Request) => Promise<ResultWithContext[]>;
}

export const validationHandler = (validator: ValidatorType): MiddlewareType<any, any, any> => {
    return (req, res, next) => {
        validator().run(req).then(() => {
            const result = validationResult(req).array();
    
            if (!result.length) return next();
            // console.log(result);
            throw ApiError.badRequest('Validation failed: ' + result[0].msg);
        }).catch((error) => next(error));
    };
};