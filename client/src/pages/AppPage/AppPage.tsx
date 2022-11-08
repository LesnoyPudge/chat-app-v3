import { Button, Icon, PageContent, PageContentNavigation, TopBar } from '@components';
import { useNavigator } from '@hooks';
import { twClassNames } from '@utils';
import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { PrivateChatList, UserToolBar } from './components';



const styles = {
    button: `flex w-full items-center px-3 h-full
    hover:bg-hover focus-visible:bg-hover group`,
    icon: `w-6 h-6 mr-3 fill-icon-200 group-hover:fill-icon-100 
    group-focus-visible:fill-icon-100 transition-none`,
};

export const AppPage: FC = () => {
    const { navigateTo, myLocationIs } = useNavigator();
    const isActive = myLocationIs.app;

    return (
        <div className='flex w-full overflow-hidden'>
            <PageContentNavigation>
                <TopBar className='mb-6'>
                    <Button
                        className={twClassNames(
                            styles.button, 
                            { 'bg-hover': isActive },
                        )}
                        isntStyled
                        isActive={isActive}
                        onClick={navigateTo.app}
                    >
                        <Icon
                            className={twClassNames(
                                styles.icon, 
                                { 'fill-icon-100': isActive },
                            )}
                            iconId='friend-icon'
                        />

                        <span className='font-medium'>
                            Друзья
                        </span>
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
