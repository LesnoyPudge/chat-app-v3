import { NextFunction, Request, Response } from 'express';
import { Send } from 'express-serve-static-core';
import { IUser } from '../../common';



export interface IRequest<RequestBody, RequestParams> extends Request<RequestParams> {
    body: RequestBody;
    params: RequestParams;
}

export interface IAuthorizedRequest<RequestBody, RequestParams> extends IRequest<RequestBody, RequestParams> {
    cookies: {
        refreshToken: string;
    };
    auth: {
        user: Partial<IUser>;
    };
}

export interface IResponse<ResponseBody> extends Response {
    json: Send<ResponseBody, this>;
}

export type MiddlewareType<RequestBody, RequestParams, ResponseBody> = (
    req: IRequest<RequestBody, RequestParams>, 
    res: IResponse<ResponseBody>, 
    next: NextFunction,
) => void;

export type AuthorizedMiddlewareType<RequestBody, RequestParams, ResponseBody> = (
    req: IAuthorizedRequest<RequestBody, RequestParams>, 
    res: IResponse<ResponseBody>, 
    next: NextFunction,
) => void;