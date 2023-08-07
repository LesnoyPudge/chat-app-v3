import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@redux/store';



export const useAppDispatch = () => {
    return {
        dispatch: useDispatch() as AppDispatch,
    };
};