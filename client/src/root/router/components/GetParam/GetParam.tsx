import { ChildrenAsNodeOrFunction } from '@components';
import { Params, useNavigator } from '@hooks';
import { PropsWithChildrenAsNodeOrFunction } from '@types';
import { Navigate } from 'react-router-dom';



type ChildrenArgs<T extends keyof Params> = Record<T, NonNullable<Params[T]>>

type GetParams<T extends keyof Params> = PropsWithChildrenAsNodeOrFunction<ChildrenArgs<T>> & {
    param: T
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const GetParam = <T extends keyof Params>({
    param,
    children,
}: GetParams<T>) => {
    const { params, navigatorPath } = useNavigator();

    const paramValue = params[param];

    const contextArgs = {
        [param]: paramValue,
    } as ChildrenArgs<T>;

    return (
        <>
            <If condition={paramValue === undefined}>
                <Navigate to={navigatorPath.app()} replace/>
            </If>

            <If condition={paramValue !== undefined}>
                <ChildrenAsNodeOrFunction args={contextArgs}>
                    {children}
                </ChildrenAsNodeOrFunction>
            </If>
        </>
    );
};