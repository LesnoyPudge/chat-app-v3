import { Conditional } from '@components';
import { useNavigator } from '@hooks';
import { AppSelectors, UserApi } from '@redux/features';
import { useAppSelector } from '@redux/hooks';
import { FC, PropsWithChildren, useEffect } from 'react';
import { Outlet } from 'react-router-dom';



export const ProtectedRoute: FC<PropsWithChildren> = () => {
    const isAuthorized = useAppSelector(AppSelectors.selectIsAuthorized);
    const navigator = useNavigator();
    const { isLoading } = UserApi.useUserRefreshQuery();

    useEffect(() => {
        if (isLoading || isAuthorized) return;

        navigator.navigateTo.auth({ replace: true, withState: true });
    }, [isAuthorized, navigator, isLoading]);

    return (
        <Conditional isRendered={isAuthorized}>
            <Outlet/>
        </Conditional>
    );
};