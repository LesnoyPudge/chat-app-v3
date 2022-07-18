import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { RootState } from 'src/redux';



export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;