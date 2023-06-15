import { Id, Override, Prettify, SocketAuth, StrictOmit, Tokens } from '@shared';
import { 
    NextFunction, 
    Response as ExpressResponse,
} from 'express';
import { Send } from 'express-serve-static-core';
import { Server, Socket } from 'socket.io';



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

export type AuthorizedSocket = StrictOmit<Socket, 'handshake'> & Override<
    Socket, 
    'handshake', 
    Socket['handshake'] & Override<
        Socket['handshake'],
        'auth',
        SocketAuth
    >
>;