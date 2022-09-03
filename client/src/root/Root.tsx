import { store } from '@redux/store';
import { FC } from 'react';
import { Provider } from 'react-redux';
import { RootRouter } from './router';
import './styles/base.scss';



export const Root: FC = () => {
    return (
        <>
            {/* <Provider store={store}> */}
            <RootRouter/>


            {/* </Provider> */}
        </>
    );
};