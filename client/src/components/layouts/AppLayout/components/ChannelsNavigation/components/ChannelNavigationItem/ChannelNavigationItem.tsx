import { ContextMenu, RefContextProvider, Tooltip } from '@components';
import { useNavigator } from '@hooks';
import classNames from 'classnames';
import { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { NavigationButton } from '..';



interface TMPChannel { 
    id: string;
    name: string;
    rooms: {id: string}[];
}

interface IChannelsNavigationItem {
    channel: TMPChannel;
}

export const ChannelsNavigationItem: FC<IChannelsNavigationItem> = ({
    channel,
}) => {
    const { myLocationIs, navigateTo } = useNavigator();
    const isActive = myLocationIs.channel(channel.id);
    const formatedName = channel.name.split(' ').map(word => word.charAt(0)).join('');
    const handleNavigate = () => navigateTo.room(channel.id, channel.rooms[0].id);

    return (
        <RefContextProvider>
            <li>
                <NavigationButton 
                    theme='brand' 
                    isActive={isActive}
                    onLeftClick={handleNavigate}
                >
                    <div className='px-[6px] w-full flex justify-center'>
                        <span 
                            className={twMerge(classNames(
                                `font-bold text-ellipsis overflow-hidden 
                                group-hover:text-white group-focus-within:text-white`,
                                { 'text-white': isActive },
                            ))}
                        >
                            {formatedName}
                        </span>
                    </div>
                </NavigationButton>
            </li>
                                    
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
};