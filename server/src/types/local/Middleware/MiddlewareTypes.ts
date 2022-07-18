import { NextFunction, Request, Response } from 'express';
import { Send, Query } from 'express-serve-static-core';
import { IUser } from '../../common';



export interface IRequest<RequestBody, RequestQuery extends Query> extends Request {
    body: RequestBody;
    query: RequestQuery;
}

export interface IAuthorizedRequest<RequestBody, RequestQuery extends Query> extends IRequest<RequestBody, RequestQuery> {
    cookies: {
        refreshToken: string;
    };
    auth?: {
        user: IUser;
    };
}

export interface IResponse<ResponseBody> extends Response {
    json: Send<ResponseBody, this>;
}

export type MiddlewareType<RequestBody, RequestQuery extends Query, ResponseBody> = (
    req: IRequest<RequestBody, RequestQuery>, 
    res: IResponse<ResponseBody>, 
    next: NextFunction,
) => any;

export type ErrorMiddlewareType<RequestBody, RequestQuery extends Query, ResponseBody> = (
    error: Error, 
    req: IRequest<RequestBody, RequestQuery>, 
    res: IResponse<ResponseBody>, 
    next: NextFunction,
) => any;

export type AuthorizedMiddlewareType<RequestBody, RequestQuery extends Query, ResponseBody> = (
    req: IAuthorizedRequest<RequestBody, RequestQuery>, 
    res: IResponse<ResponseBody>, 
    next: NextFunction,
) => any;