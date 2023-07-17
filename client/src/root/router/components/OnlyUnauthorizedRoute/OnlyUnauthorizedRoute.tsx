import { Conditional } from '@components';
import { useNavigator } from '@hooks';
import { AppSelectors } from '@redux/features';
import { useAppSelector } from '@redux/hooks';
import { FC, PropsWithChildren, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';



export const OnlyUnauthorizedRoute: FC<PropsWithChildren> = () => {
    const isAuthorized = useAppSelector(AppSelectors.selectIsAuthorized);
    const navigator = useNavigator();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthorized) return;

        navigate(navigator.stateRef.current.from, { replace: true });
    }, [isAuthorized, navigate, navigator]);

    return (
        <Conditional isRendered={!isAuthorized}>
            <Outlet/>
        </Conditional>
    );
};