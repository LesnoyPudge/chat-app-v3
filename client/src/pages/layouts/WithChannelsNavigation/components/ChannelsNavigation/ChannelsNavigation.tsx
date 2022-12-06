import { FC, useMemo } from 'react';
import { Icon, Separator, Tooltip, ContextMenu, RefContextProvider, Conditional, FocusableListItem, FocusableListWrapper, OverlayContextProvider } from '@components';
import { NavigationButton, ChannelsNavigationItem } from './components';
import { useNavigator } from '@hooks';
import { twClassNames } from '@utils';



const styles = {
    section: 'bg-primary-500 py-3 w-[72px] flex flex-col shrink-0',
    focusableListWrapper: `overflow-y-scroll scrollbar-with-gutter 
    scrollbar-hidden`,
    list: 'flex flex-col h-fit gap-2 py-1',
    homePageButtonIcon: `w-7 h-7 fill-icon-200 m-auto group-hover:fill-white 
    group-focus-within:fill-white`,
    addChannelButtonIcon: `w-7 h-7 m-auto fill-green group-hover:fill-white 
    group-focus-within:fill-white`,
};

const channels = [
    { id: '1asd', name: 'amazing channel', rooms: [{ id: '1' }] }, 
    { id: '2yk', name: 'wow', rooms: [{ id: '2' }] },
    { id: '3eh', name: 'first', rooms: [{ id: '2' }] },
    { id: '4tu.', name: '2', rooms: [{ id: '2' }] },
    { id: '5szb', name: '3', rooms: [{ id: '2' }] },
    { id: '6tru', name: '4', rooms: [{ id: '2' }] },
    { id: '7nfk', name: '5', rooms: [{ id: '2' }] },
    { id: '8f.', name: '6', rooms: [{ id: '2' }] },
    { id: '9aerg', name: '7', rooms: [{ id: '2' }] },
    { id: '10uik', name: '8', rooms: [{ id: '2' }] },
    { id: '11ou;', name: '9', rooms: [{ id: '2' }] },
    { id: '12wfEGA', name: '1 0', rooms: [{ id: '2' }] },
    { id: '13tyhd', name: '1 1', rooms: [{ id: '2' }] },
    { id: '14zfbv', name: '1 2', rooms: [{ id: '2' }] },
    { id: '15sryth', name: '1 3', rooms: [{ id: '2' }] },
    { id: '16gra', name: '1 4', rooms: [{ id: '2' }] },
    { id: '17tyjtjd', name: 'last', rooms: [{ id: '2' }] },
];

export const ChannelsNavigation: FC = () => {
    const { myLocationIs, navigateTo } = useNavigator();
    const isAppOrPrivateChatPage = myLocationIs.app || myLocationIs.anyPrivateChat;
    
    const channelsList = useMemo(() => channels.map((channel, index) => (
        <FocusableListItem key={channel.id} index={index}>
            {({ tabIndex }) => (
                <ChannelsNavigationItem 
                    channel={channel}
                    tabIndex={tabIndex}
                />
            )}
        </FocusableListItem>
    )), []);

    return (
        <div className={styles.section}>
            <OverlayContextProvider>
                <RefContextProvider>
                    <NavigationButton 
                        theme='brand' 
                        isActive={isAppOrPrivateChatPage}
                        onLeftClick={() => {
                            navigateTo.app();
                        }}
                    >
                        <Icon 
                            iconId='discord-logo'
                            className={twClassNames(
                                styles.homePageButtonIcon,
                                { 'fill-white': isAppOrPrivateChatPage },
                            )}
                        />
                    </NavigationButton>
    
                    <Tooltip preferredAligment='right'>
                        <>Главная страница</>
                    </Tooltip>
    
                    <ContextMenu 
                        preferredAligment='right'
                        openOnRightClick
                    >
                        <>menu</>
                    </ContextMenu>
                </RefContextProvider>
            </OverlayContextProvider>
                
            <Separator className='w-1/2'/>

            <Conditional isRendered={!!channels.length}>
                <FocusableListWrapper className={styles.focusableListWrapper}>
                    <ul className={styles.list}>
                        {channelsList}
                    </ul>
                </FocusableListWrapper>
            </Conditional>

            <OverlayContextProvider>
                <RefContextProvider>
                    <NavigationButton 
                        theme='action'
                        onLeftClick={() => console.log('open add channel modal')}
                    >
                        <Icon 
                            className={styles.addChannelButtonIcon}
                            iconId='add-channel-navigation-icon'
                        />
                    </NavigationButton>

                    <Tooltip preferredAligment='right'>
                        <>Добавить канал</>
                    </Tooltip>

                    <ContextMenu 
                        preferredAligment='right'
                        openOnRightClick
                    >
                        <>menu</>
                    </ContextMenu>
                </RefContextProvider>
            </OverlayContextProvider>
        </div>
    );
};