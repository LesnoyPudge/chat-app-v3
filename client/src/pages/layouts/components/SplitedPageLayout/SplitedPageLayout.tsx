import { FC, PropsWithChildren, ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { UserToolBar } from './components';



export const SplitedPageLayout: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className='flex w-full overflow-hidden'>
            <div className='flex flex-col bg-primary-300 w-[240px] overflow-hidden'>
                {children}
                
                <UserToolBar/>
            </div>

            <div className='flex flex-col bg-primary-200 w-full flex-1 overflow-hidden'>
                <Outlet/>
            </div>
        </div>
    );
};