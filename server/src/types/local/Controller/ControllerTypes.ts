import { NextFunction } from 'express';
import { IUser } from '../../common';
import { IAuthorizedRequest, IRequest, IResponse } from '../Middleware';



interface IAuthorizedControllerRequest<RequestBody, RequestParams> extends IAuthorizedRequest<RequestBody, RequestParams> {
    auth: {
        user: IUser;
    }
}

export type ControllerType<RequestBody, RequestParams, ResponseBody> = (
    req: IRequest<RequestBody, RequestParams>, 
    res: IResponse<ResponseBody>,
    next: NextFunction,
) => void;

export type AuthorizedControllerType<RequestBody, RequestParams, ResponseBody> = (
    req: IAuthorizedControllerRequest<RequestBody, RequestParams>, 
    res: IResponse<ResponseBody>, 
    next: NextFunction,
) => void;