import { NextFunction } from 'express';
import { Query } from 'express-serve-static-core';
import { IUser } from '../../common';
import { IAuthorizedRequest, IRequest, IResponse } from '../Middleware';



interface IAuthorizedControllerRequest<RequestBody, RequestQuery extends Query> extends IAuthorizedRequest<RequestBody, RequestQuery> {
    auth: {
        user: IUser;
    }
}

export type ControllerType<RequestBody, RequestQuery extends Query, ResponseBody> = (
    req: IRequest<RequestBody, RequestQuery>, 
    res: IResponse<ResponseBody>,
    next: NextFunction,
) => void;

export type AuthorizedControllerType<RequestBody, RequestQuery extends Query, ResponseBody> = (
    req: IAuthorizedControllerRequest<RequestBody, RequestQuery>, 
    res: IResponse<ResponseBody>, 
    next: NextFunction,
) => void;