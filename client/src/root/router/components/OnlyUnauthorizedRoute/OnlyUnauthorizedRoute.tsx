
import { useNavigator } from '@hooks';
import { AppSelectors, UserApi } from '@redux/features';
import { useMemoSelector } from '@redux/hooks';
import { getEnv } from '@utils';
import { FC, PropsWithChildren, useEffect } from 'react';
import { Outlet } from 'react-router-dom';



const { CUSTOM_CLIENT_ONLY } = getEnv();

export const OnlyUnauthorizedRoute: FC<PropsWithChildren> = () => {
    const isAuthorized = useMemoSelector(AppSelectors.selectIsAuthorized, []);
    const isInitialized = useMemoSelector((state) => AppSelectors.selectAppState(state).isInitialized, []);
    const isRefreshing = useMemoSelector((state) => AppSelectors.selectAppState(state).isRefreshing, []);
    const { navigate, stateRef } = useNavigator();
    const [refresh] = UserApi.useUserRefreshMutation();

    const showOutlet = (
        isInitialized &&
        !isRefreshing &&
        !isAuthorized
    ) || !!Number(CUSTOM_CLIENT_ONLY);

    const navigateOutside = (
        isInitialized &&
        !isRefreshing &&
        isAuthorized
    ) || !Number(CUSTOM_CLIENT_ONLY);

    useEffect(() => {
        if (isInitialized) return;

        refresh();
    }, [isInitialized, refresh]);

    useEffect(() => {
        if (!navigateOutside) return;

        navigate(stateRef.current.from, { replace: true });
    }, [navigateOutside, navigate, stateRef]);

    return (
        <If condition={showOutlet}>
            <Outlet/>
        </If>
    );
};