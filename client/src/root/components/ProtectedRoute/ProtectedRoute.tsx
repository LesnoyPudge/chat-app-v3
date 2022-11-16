import { Conditional } from '@components';
import { FC } from 'react';
import { Outlet } from 'react-router-dom';



export const ProtectedRoute: FC = () => {
    return (
        <Conditional isRendered={true}>
            <Outlet/>
        </Conditional>
    );
};