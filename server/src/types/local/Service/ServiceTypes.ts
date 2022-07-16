interface IAuthData {
    userId: string;
    refreshToken: string;
}

type IAuthorizedArgs<T> = T & {
    authData: IAuthData;
}

export type AuthorizedServiceType<T, R> = (args: IAuthorizedArgs<T>) => Promise<R>;

export type ServiceType<T, R> = (args: T) => Promise<R>;