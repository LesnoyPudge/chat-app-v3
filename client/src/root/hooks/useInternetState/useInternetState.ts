import { useEventListener } from '@hooks';
import { AppSlice } from '@redux/features';
import { useAppDispatch } from '@redux/hooks';



export const useInternetState = () => {
    const { dispatch } = useAppDispatch();

    useEventListener('online', () => {
        dispatch(AppSlice.actions.setIsInternetConnected(false));
    }, window);

    useEventListener('offline', () => {
        dispatch(AppSlice.actions.setIsInternetConnected(false));
    }, window);
};