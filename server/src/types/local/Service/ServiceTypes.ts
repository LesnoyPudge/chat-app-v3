


export type ServiceType<T, R> = (args: T) => Promise<R>;

export type AuthorizedServiceType<T, R> = (args: T & {userId: string}) => Promise<R>;