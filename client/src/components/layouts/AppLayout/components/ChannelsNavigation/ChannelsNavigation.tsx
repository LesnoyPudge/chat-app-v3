import { FC } from 'react';
import { Icon, Separator, Tooltip, ContextMenu, RefContextProvider } from '@components';
import { NavigationButton } from '../NavigationButton';
import classNames from 'classnames';
import { useNavigator } from '@hooks';
import { twMerge } from 'tailwind-merge';



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

                <div className='flex flex-col gap-2 py-1 overflow-y-auto custom-scrollbar-hide'>
                    {
                        channels.map((channel) => {
                            const isActive = myLocationIs.channel(channel.id);
                            const formatedName = channel.name.split(' ').map(word => word.charAt(0)).join('');
                            const handleNavigate = () => navigateTo.room(channel.id, channel.rooms[0].id);
                            
                            return (
                                <RefContextProvider key={channel.id}>
                                    <NavigationButton 
                                        theme='brand' 
                                        isActive={isActive}
                                        onLeftClick={handleNavigate}
                                    >
                                        <div className='px-[6px] w-full flex justify-center'>
                                            <span 
                                                className={twMerge(classNames(
                                                    'font-bold text-ellipsis overflow-hidden group-hover:text-white group-focus-within:text-white',
                                                    {
                                                        'text-white': isActive,
                                                    },
                                                ))}
                                            >
                                                {formatedName}
                                            </span>
                                        </div>
                                    </NavigationButton>
                                    
                                    <Tooltip position='right'>
                                        {channel.name}
                                    </Tooltip>

                                    <ContextMenu>
                                        {() => (
                                            <>menu</>
                                        )}
                                    </ContextMenu>
                                </RefContextProvider>
                            );
                        })
                    }
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