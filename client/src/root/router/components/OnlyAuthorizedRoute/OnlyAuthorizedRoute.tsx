import { EntityContextProvider } from '@components';
import { useNavigator } from '@hooks';
import { AppSelectors, UserApi } from '@redux/features';
import { useMemoSelector } from '@redux/hooks';
import { FC, PropsWithChildren, useEffect } from 'react';
import { Outlet } from 'react-router-dom';



export const OnlyAuthorizedRoute: FC<PropsWithChildren> = () => {
    const isAuthorized = useMemoSelector(AppSelectors.selectIsAuthorized);
    const isInitialized = useMemoSelector((state) => AppSelectors.selectAppState(state).isInitialized);
    const isRefreshing = useMemoSelector((state) => AppSelectors.selectAppState(state).isRefreshing);
    const myId = useMemoSelector((state) => AppSelectors.selectMe(state).id);
    const { navigateTo } = useNavigator();
    const [refresh] = UserApi.useUserRefreshMutation();

    const shouldNavigateToAuth = (
        isInitialized &&
        !isRefreshing &&
        !isAuthorized
    );

    useEffect(() => {
        if (isInitialized) return;

        refresh();
    }, [isInitialized, refresh]);

    useEffect(() => {
        if (!shouldNavigateToAuth) return;

        navigateTo.auth({ replace: true, withState: true });
    }, [navigateTo, shouldNavigateToAuth]);

    return (
        <If condition={isAuthorized}>
            <EntityContextProvider.User id={myId}>
                <Outlet/>
            </EntityContextProvider.User>
        </If>
    );
};