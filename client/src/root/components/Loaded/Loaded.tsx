import { FC, useContext, useEffect } from 'react';
import { useIsFirstRender } from 'usehooks-ts';
import { LoadingContext } from '../Loader';
import { Outlet } from 'react-router-dom';



export const Loaded: FC = () => {
    const isFirstRender = useIsFirstRender();
    const { finishLoading } = useContext(LoadingContext) as LoadingContext;

    useEffect(() => {
        isFirstRender && finishLoading();
    }, [isFirstRender, finishLoading]);

    return (
        <Outlet/>
    );
};