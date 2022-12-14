import { ContextMenu, RefContextProvider, Tooltip } from '@components';
import { useNavigator } from '@hooks';
import { twClassNames } from '@utils';
import { FC } from 'react';
import { NavigationButton } from '..';



interface TMPChannel { 
    id: string;
    name: string;
    rooms: {id: string}[];
}

interface IChannelsNavigationItem {
    channel: TMPChannel;
    tabIndex: number;
}

const styles = {
    contentWrapper: 'px-[6px] w-full flex justify-center',
    content: {
        base: `font-bold truncated group-hover:text-white 
        group-focus-within:text-white`,
        active: 'text-white',
    },
};

export const ChannelsNavigationItem: FC<IChannelsNavigationItem> = ({
    channel,
    tabIndex,
}) => {
    const { myLocationIs, navigateTo } = useNavigator();
    const isActive = myLocationIs.channel(channel.id);
    const formatedName = channel.name.split(' ').map(word => word.charAt(0)).join('');
    const handleNavigate = () => navigateTo.room(channel.id, channel.rooms[0].id);

    return (
        <li>
            <RefContextProvider>
                <NavigationButton 
                    theme='brand' 
                    isActive={isActive}
                    tabIndex={tabIndex}
                    onLeftClick={handleNavigate}
                >
                    <div className={styles.contentWrapper}>
                        <span 
                            className={twClassNames(
                                styles.content.base,
                                { [styles.content.active]: isActive },
                            )}
                        >
                            {formatedName}
                        </span>
                    </div>
                </NavigationButton>
                                        
                <Tooltip preferredAligment='right'>
                    {channel.name}
                </Tooltip>
    
                <ContextMenu preferredAligment='right'>
                    <>menu</>
                </ContextMenu>
            </RefContextProvider>
        </li>
    );
};