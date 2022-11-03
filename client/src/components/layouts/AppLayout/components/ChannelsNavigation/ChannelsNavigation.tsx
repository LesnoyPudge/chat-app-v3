import { FC, useMemo } from 'react';
import { Icon, Separator, Tooltip, ContextMenu, RefContextProvider } from '@components';
import { NavigationButton } from './components/NavigationButton';
import classNames from 'classnames';
import { useNavigator } from '@hooks';
import { AutoSizer, Scrollbars } from '@libs';
import { ChannelsNavigationItem } from './components';



export const ChannelsNavigation: FC = () => {
    const { myLocationIs, navigateTo } = useNavigator();
    const isAppOrPrivateChatPage = myLocationIs.app || myLocationIs.anyPrivateChat;
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
    const channelsList = useMemo(() => channels.map((channel) => (
        <ChannelsNavigationItem 
            channel={channel} 
            key={channel.id}
        />
    )), [channels]);

    return (
        <>
            <div className='bg-primary-500 py-3 w-[72px] flex flex-col shrink-0'>
                <RefContextProvider>
                    <NavigationButton 
                        theme='brand' 
                        isActive={isAppOrPrivateChatPage}
                        onLeftClick={navigateTo.app}
                    >
                        <Icon 
                            iconId='discord-logo'
                            height={28} 
                            width={28}
                            className={classNames(
                                'fill-icon-100 m-auto group-hover:fill-white group-focus-within:fill-white',
                                {
                                    'fill-white': isAppOrPrivateChatPage,
                                },
                            )}
                        />
                    </NavigationButton>

                    <Tooltip position='right'>
                        Главная страница
                    </Tooltip>

                    <ContextMenu>
                        {() => (
                            <>menu</>
                        )}
                    </ContextMenu>
                </RefContextProvider>
                
                <Separator className='w-1/2'/>

                <div className='h-full overflow-hidden'>
                    <AutoSizer>
                        <Scrollbars autoSized>
                            <ul className='flex flex-col h-full gap-2 py-1'>
                                {channelsList}
                            </ul>
                        </Scrollbars>
                    </AutoSizer>
                </div>

                <Separator className='w-1/2'/>

                <RefContextProvider>
                    <NavigationButton 
                        theme='action'
                        onLeftClick={() => console.log('open add channel modal')}
                    >
                        <Icon 
                            iconId='add-channel-navigation-icon'
                            height={28} 
                            width={28}
                            className='m-auto fill-green group-hover:fill-white group-focus-within:fill-white'
                        />
                    </NavigationButton>

                    <Tooltip position='right'>
                        Добавить канал
                    </Tooltip>

                    <ContextMenu>
                        {() => (
                            <>menu</>
                        )}
                    </ContextMenu>
                </RefContextProvider>
            </div>
        </>
    );
};