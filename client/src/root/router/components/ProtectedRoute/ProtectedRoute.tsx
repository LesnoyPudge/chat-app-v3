import { Conditional } from '@components';
import { useNavigator } from '@hooks';
import { AppSelectors, UserApi } from '@redux/features';
import { useAppSelector } from '@redux/hooks';
import { FC, PropsWithChildren, useEffect } from 'react';
import { Outlet } from 'react-router-dom';



export const ProtectedRoute: FC<PropsWithChildren> = () => {
    const isAuthorized = useAppSelector(AppSelectors.selectIsAuthorized);
    const isInitialized = useAppSelector(AppSelectors.selectIsInitialized);
    const isRefreshing = useAppSelector(AppSelectors.selectIsRefreshing);
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
        <Conditional isRendered={isAuthorized}>
            <Outlet/>
        </Conditional>
    );
};