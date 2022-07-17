import { NextFunction } from 'express';
import { Query } from 'express-serve-static-core';
import { IAuthorizedRequest, IRequest, IResponse } from '../Middleware';



export type ControllerType<RequestBody, RequestQuery extends Query, ResponseBody> = (
    req: IRequest<RequestBody, RequestQuery>, 
    res: IResponse<ResponseBody>,
    next: NextFunction,
) => void;

export type AuthorizedControllerType<RequestBody, RequestQuery extends Query, ResponseBody> = (
    req: IAuthorizedRequest<RequestBody, RequestQuery>, 
    res: IResponse<ResponseBody>, 
    next: NextFunction,
) => void;