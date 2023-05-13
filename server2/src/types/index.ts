import { 
    NextFunction, 
    Request as ExpressRequest,
    Response as ExpressResponse,
} from 'express';
import { Send } from 'express-serve-static-core';



interface AuthorizationData {
    cookies: {
        refreshToken: string;
        accessToken: string;
    };
        // user: Partial<IUser>;
    user: {
        id: '123',
        name: 'wow',
    }
}

export interface Request<RequestBody> extends Pick<ExpressRequest, 'headers'>, Partial<AuthorizationData> {
    body: RequestBody;
}

export type AuthorizedRequest<RequestBody> = Required<AuthorizationData> & Request<RequestBody>;

export interface Response<ResponseBody> extends ExpressResponse {
    json: Send<ResponseBody, this>;
}

export type Middleware<RequestBody, ResponseBody> = (
    req: Request<RequestBody>, 
    res: Response<ResponseBody>, 
    next: NextFunction,
) => void;

export type AuthorizedMiddleware<RequestBody, ResponseBody> = (
    req: AuthorizedRequest<RequestBody>, 
    res: Response<ResponseBody>, 
    next: NextFunction,
) => void;