import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icon, Separator, Tooltip, ContextMenu, RefContextProvider } from '@components';
import { NavigationButton } from '../NavigationButton';



export const ChannelsNavigation: FC = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
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
    const isAppPage = pathname === '/app';
    const isPrivateChatPage = pathname.includes('/app/private-chat');

    return (
        <>
            <div className='bg-primary-500 py-3 w-[72px] flex flex-col shrink-0'>
                <RefContextProvider>
                    <NavigationButton 
                        theme='brand' 
                        isActive={isAppPage || isPrivateChatPage}
                        onLeftClick={() => navigate('/app')}
                    >
                        <Icon 
                            iconId='home-page-navigation-icon'
                            height={28} 
                            width={28}
                            className={
                                `fill-icon-100 m-auto group-hover:fill-white group-focus-within:fill-white
                                    ${(isAppPage || isPrivateChatPage) && 'fill-white'}`
                            }
                        />
                    </NavigationButton>

                    <Tooltip position='right'>
                        Главная страница
                    </Tooltip>

                    <ContextMenu>
                        <>menu</>
                    </ContextMenu>
                </RefContextProvider>
                
                <Separator/>

                <div className='flex flex-col gap-2 py-1 overflow-y-auto custom-scrollbar-hide'>
                    {
                        channels.map((channel) => {
                            const isActive = pathname.includes(`/app/channel/${channel.id}`);
                            const navigateTo = () => navigate(`/app/channel/${channel.id}/room/${channel.rooms[0].id}`);
                            const formatedName = channel.name.split(' ').map(word => word.charAt(0)).join('');
                            
                            return (
                                <RefContextProvider key={channel.id}>
                                    <NavigationButton 
                                        theme='brand' 
                                        isActive={isActive}
                                        onLeftClick={navigateTo}
                                    >
                                        <div className='px-[6px] w-full flex justify-center'>
                                            <span 
                                                className={`font-bold text-ellipsis overflow-hidden 
                                                group-hover:text-white group-focus:text-white 
                                                ${isActive && 'text-white'}`}
                                            >
                                                {formatedName}
                                            </span>
                                        </div>
                                    </NavigationButton>
                                    
                                    <Tooltip position='right'>
                                        {channel.name}
                                    </Tooltip>

                                    <ContextMenu>
                                        <>menu</>
                                    </ContextMenu>
                                </RefContextProvider>
                            );
                        })
                    }
                </div>

                <Separator/>

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
                        <>menu</>
                    </ContextMenu>
                </RefContextProvider>
            </div>
        </>
    );
};