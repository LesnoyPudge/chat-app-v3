import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icon, Separator, Tooltip } from '@components';
import { NavigationButton } from '../NavigationButton';



export const ChannelsNavigation: FC = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const channels = [
        { id: '1', name: 'amazing channel', rooms: [{ id: '1' }] }, 
        { id: '2', name: 'wow', rooms: [{ id: '2' }] },
        { id: '3', name: 'first', rooms: [{ id: '2' }] },
        { id: '4', name: '2', rooms: [{ id: '2' }] },
        { id: '5', name: '3', rooms: [{ id: '2' }] },
        { id: '6', name: '4', rooms: [{ id: '2' }] },
        { id: '7', name: '5', rooms: [{ id: '2' }] },
        { id: '8', name: '6', rooms: [{ id: '2' }] },
        { id: '9', name: '7', rooms: [{ id: '2' }] },
        { id: '10', name: '8', rooms: [{ id: '2' }] },
        { id: '11', name: '9', rooms: [{ id: '2' }] },
        { id: '12', name: '1 0', rooms: [{ id: '2' }] },
        { id: '13', name: '1 1', rooms: [{ id: '2' }] },
        { id: '14', name: '1 2', rooms: [{ id: '2' }] },
        { id: '15', name: '1 3', rooms: [{ id: '2' }] },
        { id: '16', name: '1 4', rooms: [{ id: '2' }] },
        { id: '17', name: 'last', rooms: [{ id: '2' }] },
    ];

    return (
        <>
            <div className='bg-primary-500 py-3 w-[72px] flex flex-col shrink-0'>
                <Tooltip
                    content='Главная страница'
                    position='right'
                >
                    <NavigationButton 
                        theme='brand' 
                        isActive={pathname === '/app'}
                        onClick={() => navigate('/app')}
                    >
                        <Icon 
                            iconId='home-page-navigation-icon'
                            height={28} 
                            width={28}
                            className={
                                `fill-icon-100 group-hover:fill-white m-auto
                            ${pathname === '/app' && 'fill-white'}`
                            }
                        />
                    </NavigationButton>
                </Tooltip>
                

                <Separator/>

                <ul className='flex flex-col gap-2 overflow-y-auto scroll-my-1 custom-scrollbar-hide'>
                    {
                        channels.map((channel) => {
                            const isActive = pathname.includes(`/app/channel/${channel.id}`);
                            const navigateTo = () => navigate(`/app/channel/${channel.id}/room/${channel.rooms[0].id}`);
                            const formatedName = channel.name.split(' ').map(word => word.charAt(0)).join('');
                            
                            return (
                                <Tooltip content={channel.name} position='right' key={channel.id}>
                                    <NavigationButton 
                                        theme='brand' 
                                        isActive={isActive}
                                        onClick={navigateTo}
                                    >
                                        <div className='px-[6px] w-full flex justify-center'>
                                            <span className='font-bold text-ellipsis overflow-hidden'>
                                                {formatedName}
                                            </span>
                                        </div>
                                    </NavigationButton>
                                </Tooltip>
                            );
                        })
                    }
                </ul>

                <Separator/>

                <Tooltip content='Добавить канал' position='right'>
                    <NavigationButton 
                        theme='action'
                        onClick={() => console.log('open add channel modal')}
                    >
                        <Icon 
                            iconId='add-channel-navigation-icon'
                            height={28} 
                            width={28}
                            className='fill-green group-hover:fill-white m-auto'
                        />
                    </NavigationButton>
                </Tooltip>
            </div>
        </>
    );
};