import { TopBar, Button,SpriteImage } from '@components';
import { useNavigator } from '@hooks';
import { cn } from '@utils';
import { FC } from 'react';



const styles = {
    button: {
        base: `flex w-full items-center px-3 h-full font-medium
        hover:bg-primary-hover focus-visible:bg-primary-hover group`,
        active: 'bg-primary-hover'
    },
    icon: {
        base: `w-6 h-6 mr-3 fill-icon-300 group-hover:fill-icon-200 
        group-focus-visible:fill-icon-200 transition-none`,
        active: 'fill-icon-200'
    },
};

export const Header: FC = () => {
    const { navigateTo, myLocationIs } = useNavigator();
    const isActive = myLocationIs.app();

    return (
        <TopBar>
            <Button
                className={cn(
                    styles.button.base,
                    { [styles.button.active]: isActive },
                )}
                isActive={isActive}
                onLeftClick={() => navigateTo.app()}
            >
                <SpriteImage
                    className={cn(
                        styles.icon.base,
                        { [styles.icon.active]: isActive },
                    )}
                    name='FRIEND_ICON'
                />

                <span>
                    <>Друзья</>
                </span>
            </Button>
        </TopBar>
    );
};