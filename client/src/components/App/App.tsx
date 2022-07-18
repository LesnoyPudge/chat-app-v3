import { FC, useEffect } from 'react';
import Cookies from 'js-cookie';
import { getUser, initiate, notAuthorized, useUserRefreshQuery } from 'src/redux/features';
import { Router } from './Router';
import { useAppDispatch, useAppSelector } from 'src/hooks';



export const App: FC = () => {
    // const [refresh] = useUserRefreshMutation();
    const user = useAppSelector(getUser);
    const dispatch = useAppDispatch();
    const { isLoading } = useUserRefreshQuery();
    if (isLoading && !user.isInit) dispatch(initiate());
    // refresh();
    // useEffect(() => {
    //     const refreshToken = Cookies.get('refreshToken');

    //     if (!refreshToken) {
    //         dispatch(notAuthorized());
    //     } else {
    //         refresh();
    //     }
    // }, [dispatch, refresh]);

    // const checkAuth = async () => {
    //     const refreshToken = Cookies.get('refreshToken');

    //     if (!refreshToken) {
    //         dispatch(notAuthorized());
    //     } else {
    //         await refresh();
    //     }
    // }

    // checkAuth();
    return (
        <Router/>
    );
};