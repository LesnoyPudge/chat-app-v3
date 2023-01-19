import { Button, Icon, OverlayContextProvider, RefContextProvider, TopBar } from '@components';
import { useNavigator } from '@hooks';
import { conditional, twClassNames } from '@utils';
import { FC } from 'react';
import { ChannelMenu } from './components';



const styles = {
    topBar: {
        base: 'relative hover:bg-hover focus-within:bg-hover',
        acvive: 'bg-hover',
    },
    button: 'flex justify-between items-center w-full h-full px-4',
    buttonText: 'font-semibold text-primary',
    buttonIcon: 'w-4 h-4 fill-icon-100',
};

export const Header: FC = () => {
    const { params } = useNavigator();

    const channelLabel = `ch name ${params.channelId}`;
    
    return (
        <OverlayContextProvider>
            {({ openOverlay, isOverlayExist }) => {
                const iconId = conditional('cross-icon', 'dropdown-arrow-icon', isOverlayExist);
                
                return (
                    <TopBar className={twClassNames(
                        styles.topBar.base, 
                        { [styles.topBar.acvive]: isOverlayExist },
                    )}>
                        <RefContextProvider>
                            <Button
                                className={styles.button}
                                label='Открыть меню канала'
                                hasPopup='menu'
                                isActive={isOverlayExist}
                                onLeftClick={openOverlay}
                            >
                                <span className={styles.buttonText}>
                                    {channelLabel}
                                </span>
            
                                <Icon
                                    className={styles.buttonIcon}
                                    iconId={iconId}
                                />
                            </Button>

                            <ChannelMenu/>
                        </RefContextProvider>
                    </TopBar>
                );
            }}
        </OverlayContextProvider>
    );
};