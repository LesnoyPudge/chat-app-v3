import { Conditional } from '@components';
import { useNavigator } from '@hooks';
import { AppSelectors } from '@redux/features';
import { useAppSelector } from '@redux/hooks';
import { FC, PropsWithChildren, useEffect } from 'react';
import { Outlet } from 'react-router-dom';



export const ProtectedRoute: FC<PropsWithChildren> = () => {
    const isAuthorized = useAppSelector(AppSelectors.selectIsAuthorized);
    const navigator = useNavigator();

    // useEffect(() => {
    //     if (!isAuthorized) navigator.navigateTo.auth();
    // }, [isAuthorized, navigator]);

    return (
        <Conditional isRendered={isAuthorized || true}>
            <Outlet/>
        </Conditional>
    );
};