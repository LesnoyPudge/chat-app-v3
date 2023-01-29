import { TopBar, Button, Icon } from '@components';
import { useNavigator } from '@hooks';
import { twClassNames } from '@utils';
import { FC } from 'react';



const styles = {
    button: `flex w-full items-center px-3 h-full
    hover:bg-primary-hover focus-visible:bg-primary-hover group`,
    icon: `w-6 h-6 mr-3 fill-icon-300 group-hover:fill-icon-200 
    group-focus-visible:fill-icon-200 transition-none`,
};

export const Header: FC = () => {
    const { navigateTo, myLocationIs } = useNavigator();
    const isActive = myLocationIs.app;

    return (
        <TopBar>
            <Button
                className={twClassNames(
                    styles.button, 
                    { 'bg-primary-hover': isActive },
                )}
                isActive={isActive}
                onLeftClick={navigateTo.app}
            >
                <Icon
                    className={twClassNames(
                        styles.icon, 
                        { 'fill-icon-200': isActive },
                    )}
                    iconId='friend-icon'
                />

                <span className='font-medium'>
                        Друзья
                </span>
            </Button>
        </TopBar>
    );
};