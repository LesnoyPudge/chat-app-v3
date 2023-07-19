import { Conditional } from '@components';
import { useNavigator } from '@hooks';
import { AppSelectors, UserApi } from '@redux/features';
import { useAppSelector } from '@redux/hooks';
import { FC, PropsWithChildren, useEffect } from 'react';
import { Outlet } from 'react-router-dom';



export const OnlyUnauthorizedRoute: FC<PropsWithChildren> = () => {
    const isAuthorized = useAppSelector(AppSelectors.selectIsAuthorized);
    const isInitialized = useAppSelector(AppSelectors.selectIsInitialized);
    const isRefreshing = useAppSelector(AppSelectors.selectIsRefreshing);
    const { navigate, stateRef } = useNavigator();
    const [refresh] = UserApi.useUserRefreshMutation();

    const showOutlet = (
        isInitialized &&
        !isRefreshing &&
        !isAuthorized
    );

    const navigateOutside = (
        isInitialized &&
        !isRefreshing &&
        isAuthorized
    );

    useEffect(() => {
        if (isInitialized) return;

        refresh();
    }, [isInitialized, refresh]);

    useEffect(() => {
        if (!navigateOutside) return;

        navigate(stateRef.current.from, { replace: true });
    }, [navigateOutside, navigate, stateRef]);

    return (
        <Conditional isRendered={showOutlet}>
            <Outlet/>
        </Conditional>
    );
};