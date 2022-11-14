import { TopBar, Button, Icon } from '@components';
import { useNavigator } from '@hooks';
import { twClassNames } from '@utils';
import { FC } from 'react';



const styles = {
    button: `flex w-full items-center px-3 h-full
    hover:bg-hover focus-visible:bg-hover group`,
    icon: `w-6 h-6 mr-3 fill-icon-300 group-hover:fill-icon-200 
    group-focus-visible:fill-icon-200 transition-none`,
};

export const Header: FC = () => {
    const { navigateTo, myLocationIs } = useNavigator();
    const isActive = myLocationIs.app;

    return (
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