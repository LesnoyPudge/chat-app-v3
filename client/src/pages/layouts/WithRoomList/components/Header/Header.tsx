import { Button, Icon, OverlayContextProvider, RefContextProvider, TopBar } from '@components';
import { useNavigator } from '@hooks';
import { conditional, twClassNames } from '@utils';
import { FC } from 'react';
import { ChannelMenu } from './components';



const styles = {
    topBar: 'relative hover:bg-hover focus-within:bg-hover',
    button: 'flex justify-between items-center w-full h-full px-4',
};

export const Header: FC = () => {
    const { params } = useNavigator();

    const channelLabel = `Канал ${params.channelId} ${params.roomId}`;
    
    return (
        
        <OverlayContextProvider>
            {({ openOverlay, isOverlayExist }) => {
                const iconId = conditional('cross-icon', 'dropdown-arrow-icon', isOverlayExist);
                
                return (
                    <TopBar className={twClassNames(styles.topBar, { 'bg-hover': isOverlayExist })}>
                        <RefContextProvider>
                            <Button
                                className={styles.button}
                                label='Открыть меню канала'
                                hasPopup='menu'
                                onLeftClick={openOverlay}
                            >
                                <span className='font-semibold text-primary'>
                                    {channelLabel}
                                </span>
            
                                <Icon
                                    className='w-4 h-4 fill-icon-100'
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