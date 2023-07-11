import { Entities, Id, Prettify, SocketClientEvents, SocketServerEvents, Tokens } from '@shared';
import { 
    NextFunction, 
    Response as ExpressResponse,
} from 'express';
import { Send } from 'express-serve-static-core';
import { Server, Socket } from 'socket.io';




export type UserData = Prettify<Entities.User.Token & Pick<Tokens, 'accessToken'>>;

interface WithAuthorizationCookies {
    cookies: Prettify<Pick<Tokens, 'accessToken'> & Partial<Pick<Tokens, 'refreshToken'>>>;
}

interface WithAuthorizationData {
    auth: WithAuthorizationCookies['cookies'] & {
        id: Id;
    }
}

type WithAuthorization = Prettify<WithAuthorizationCookies & WithAuthorizationData>;

export interface Request<RequestBody> extends Partial<WithAuthorization> {
    body: RequestBody;
    params: Record<string, unknown>;
}

export type AuthorizedRequest<RequestBody> = Required<WithAuthorization> & Request<RequestBody>;

export interface Response<ResponseBody> extends ExpressResponse {
    json: Send<ResponseBody, this>;
}

export type Middleware<RequestBody = unknown, ResponseBody = unknown> = (
    req: Request<RequestBody>, 
    res: Response<ResponseBody>, 
    next: NextFunction,
) => unknown;

export type AuthorizedMiddleware<RequestBody = unknown, ResponseBody = unknown> = (
    req: AuthorizedRequest<RequestBody>, 
    res: Response<ResponseBody>, 
    next: NextFunction,
) => unknown;

export type Service<Body, Return> = (
    Pick<Body, keyof Body> extends never | void | Record<string, never>
        ? () => Promise<Return> 
        : (body: Prettify<Pick<Body, keyof Body>>) => Promise<Return>
);

export type AuthorizedService<Body, Return> = (
    Pick<Body, keyof Body> extends never | void | Record<string, never>
        ? (auth: Prettify<Pick<WithAuthorization, 'auth'>['auth']>) => Promise<Return>
        : (auth: Prettify<Pick<WithAuthorization, 'auth'>['auth']>, body: Body) => Promise<Return>
);

export type AuthorizedServer = Server<SocketClientEvents, SocketServerEvents, object, UserData>;

export type AuthorizedSocket = Socket<SocketClientEvents, SocketServerEvents, object, UserData>;