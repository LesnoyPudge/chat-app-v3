import Express from 'express';
import { Send, Query } from 'express-serve-static-core';



interface TypedRequest<RequestBody, RequestQuery extends Query> extends Express.Request {
    body: RequestBody;
    query: RequestQuery;
}

interface TypedResponse<ResponseBody> extends Express.Response {
    json: Send<ResponseBody, this>;
}

export type ControllerType<RequestBody, RequestQuery extends Query, ResponseBody> = (
    req: TypedRequest<RequestBody, RequestQuery>, 
    res: TypedResponse<ResponseBody>, 
    next: Express.NextFunction,
) => void;