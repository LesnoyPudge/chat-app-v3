import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/redux';



export const useAppDispatch = () => useDispatch<AppDispatch>();