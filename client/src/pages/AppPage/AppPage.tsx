import { Button, Icon, PageContent, PageContentNavigation, TopBar } from '@components';
import { useNavigator } from '@hooks';
import classNames from 'classnames';
import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { PrivateChatList, UserToolBar } from './components';



const buttonCN = `flex w-full items-center px-3 h-full
hover:bg-hover focus-visible:bg-hover group`;
const iconCN = `mr-3 fill-icon-200 group-hover:fill-icon-100 
group-focus-visible:fill-icon-100 transition-none`;

export const AppPage: FC = () => {
    const { navigateTo, myLocationIs } = useNavigator();
    const isActive = myLocationIs.app;

    return (
        <div className='flex w-full'>
            <PageContentNavigation>
                <TopBar className='mb-6'>
                    <Button
                        className={twMerge(classNames(buttonCN, { 'bg-hover': isActive }))}
                        isDefaultStyled={false}
                        isActive={isActive}
                        onClick={navigateTo.app}
                    >
                        <Icon
                            className={twMerge(classNames(iconCN, { 'fill-icon-100': isActive }))}
                            iconId='friend-icon'
                            height={24}
                            width={24}
                        />

                        <span className='font-medium'>Друзья</span>
                    </Button>
                </TopBar>

                <PrivateChatList/>
                
                <UserToolBar/>
            </PageContentNavigation>

            <PageContent>
                <Outlet/>
            </PageContent>
        </div>
    );
};
