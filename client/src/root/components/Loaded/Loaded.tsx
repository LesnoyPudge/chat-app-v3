import { FC, useContext, useEffect } from 'react';
import { useIsFirstRender } from 'usehooks-ts';
import { ILoadingContext, LoadingContext } from '../Loader';



export const Loaded: FC = () => {
    const isFirstRender = useIsFirstRender();
    const { finishLoading } = useContext(LoadingContext) as ILoadingContext;
    
    useEffect(() => {
        isFirstRender && finishLoading();
    }, [isFirstRender, finishLoading]);
    
    return null;
};