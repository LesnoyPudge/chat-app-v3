import { FC } from 'react';
import { Icon, Tooltip, RefContextProvider, OverlayContextProvider, CreateChannelModal, Button, Conditional, Separator, ContextMenu, Image, ArrowFocusContextProvider, ArrowFocusItem } from '@components';
import { WrapperWithBullet } from './components';
import { useNavigator } from '@hooks';
import { twClassNames } from '@utils';



const channels = [
    { avatar: 'https://picsum.photos/80', id: '1asd', name: 'amazing channel', rooms: [{ id: '1' }] }, 
    { avatar: 'https://picsum.photos/81', id: '2yk', name: 'wow', rooms: [{ id: '2' }] },
    { avatar: '', id: '3eh', name: 'first', rooms: [{ id: '2' }] },
    { avatar: '', id: '4tu.', name: '2', rooms: [{ id: '2' }] },
    { avatar: 'https://picsum.photos/82', id: '5szb', name: '3', rooms: [{ id: '2' }] },
    { avatar: '', id: '6tru', name: '4', rooms: [{ id: '2' }] },
    { avatar: '', id: '7nfk', name: '5', rooms: [{ id: '2' }] },
    { avatar: '', id: '8f.', name: '6', rooms: [{ id: '2' }] },
    { avatar: '', id: '9aerg', name: '7', rooms: [{ id: '2' }] },
    { avatar: 'https://picsum.photos/83', id: '10uik', name: '8', rooms: [{ id: '2' }] },
    { avatar: '', id: '11ou;', name: '9', rooms: [{ id: '2' }] },
    { avatar: 'https://picsum.photos/84', id: '12wfEGA', name: '1 0', rooms: [{ id: '2' }] },
    { avatar: 'https://picsum.photos/85', id: '13tyhd', name: '1 1', rooms: [{ id: '2' }] },
    { avatar: '', id: '14zfbv', name: '1 2', rooms: [{ id: '2' }] },
    { avatar: '', id: '15sryth', name: '1 3', rooms: [{ id: '2' }] },
    { avatar: '', id: '16gra', name: '1 4 4 56 78 8', rooms: [{ id: '2' }] },
    { avatar: '', id: '17tyjtjd', name: 'last', rooms: [{ id: '2' }] },
];

const styles = {
    wrapper: 'flex flex-col shrink-0 gap-2 h-screen w-[72px] py-3 bg-primary-500',
    button: {
        base: `w-12 h-12 mx-auto flex justify-center items-center bg-primary-300 
        rounded-3xl overflow-hidden transition-all ease-linear
        hover:rounded-2xl focus-visible:rounded-2xl hover:text-white 
        focus-visible:text-white peer`,
        active: 'rounded-2xl text-white',
    },
    icon: 'w-7 h-7 transition-all ease-linear',
    addChannelButton: {
        base: `hover:bg-positive focus-visible:bg-positive 
        fill-positive hover:fill-white focus-visible:fill-white`,
        active: 'bg-positive fill-white',
    },
    brandButton: {
        base: `hover:bg-brand focus-visible:bg-brand 
        fill-icon-200 hover:fill-white focus-visible:fill-white`,
        active: 'bg-brand fill-white',
    },
    focusableListWrapper: 'overflow-y-scroll scrollbar-hidden',
    channelList: 'flex flex-col h-fit gap-2',
    channelName: 'font-bold truncated px-1.5',
};

export const ChannelsNavigation: FC = () => {
    const { myLocationIs, navigateTo } = useNavigator();
    const isInAppOrPrivateChatPage = myLocationIs.app || myLocationIs.anyPrivateChat;

    return (
        <div className={styles.wrapper}>
            <WrapperWithBullet isActive={isInAppOrPrivateChatPage}>
                <RefContextProvider>
                    <Button
                        className={twClassNames(
                            styles.button.base,
                            styles.brandButton.base,
                            { 
                                [styles.button.active]: isInAppOrPrivateChatPage,
                                [styles.brandButton.active]: isInAppOrPrivateChatPage, 
                            },
                        )}
                        label='Перейти на главную страницу'
                        onLeftClick={navigateTo.app}
                    >
                        <Icon 
                            className={styles.icon}
                            iconId='discord-logo'
                        />
                    </Button>

                    <Tooltip preferredAligment='right'>
                        <>Главная страница</>
                    </Tooltip>
                </RefContextProvider>
            </WrapperWithBullet>

            <Conditional isRendered={!!channels.length}>
                <Separator className='w-1/2' spacing={0}/>

                <ArrowFocusContextProvider list={channels} direction='vertical'>
                    <div className={styles.focusableListWrapper}>
                        <ul className={styles.channelList}>
                            {channels.map((channel) => {
                                const isInChannel = myLocationIs.channel(channel.id);
                                const formatedChannelName = channel.name.split(' ').map(word => word.charAt(0)).join('');
                            
                                const handleNavigateToChannel = () => navigateTo.channel(channel.id);

                                return (
                                    <ArrowFocusItem id={channel.id} key={channel.id} >
                                        {({ tabIndex }) => (
                                            <WrapperWithBullet isActive={isInChannel}>
                                                <RefContextProvider>
                                                    <Button
                                                        className={twClassNames(
                                                            styles.button.base, 
                                                            styles.brandButton.base,
                                                            { 
                                                                [styles.button.active]: isInChannel,
                                                                [styles.brandButton.active]: isInChannel, 
                                                            },
                                                        )}
                                                        tabIndex={tabIndex}
                                                        label={channel.name}
                                                        onLeftClick={handleNavigateToChannel}
                                                    >
                                                        <Conditional isRendered={!channel.avatar}>
                                                            <span className={styles.channelName}>
                                                                {formatedChannelName}
                                                            </span>
                                                        </Conditional>

                                                        <Conditional isRendered={!!channel.avatar}>
                                                            <Image
                                                                src={channel.avatar}
                                                                alt={`Значок канала '${channel.name}'`}
                                                            />
                                                        </Conditional>
                                                    </Button>

                                                    <Tooltip preferredAligment='right'>
                                                        <>{channel.name}</>
                                                    </Tooltip>

                                                    <ContextMenu preferredAligment='right'>
                                                        <>menu</>
                                                    </ContextMenu>
                                                </RefContextProvider>
                                            </WrapperWithBullet>
                                        )}
                                    </ArrowFocusItem>
                                );
                            })}
                        </ul>
                    </div>
                </ArrowFocusContextProvider>

                <Separator className='w-1/2' spacing={0}/>
            </Conditional>
            
            <OverlayContextProvider>
                {({ openOverlay, isOverlayExist }) => (
                    <WrapperWithBullet isActive={isOverlayExist}>
                        <RefContextProvider>
                            <Button
                                className={twClassNames(
                                    styles.button.base, 
                                    styles.addChannelButton.base,
                                    { 
                                        [styles.button.active]: isOverlayExist,
                                        [styles.addChannelButton.active]: isOverlayExist, 
                                    },
                                )}
                                hasPopup='dialog'
                                isActive={isOverlayExist}
                                label='Добавить канал'
                                onLeftClick={openOverlay}
                            >
                                <Icon 
                                    className={styles.icon}
                                    iconId='add-channel-navigation-icon'
                                />
                            </Button>

                            <CreateChannelModal/>

                            <Tooltip preferredAligment='right'>
                                <>Добавить канал</>
                            </Tooltip>
                        </RefContextProvider>
                    </WrapperWithBullet>  
                )}
            </OverlayContextProvider>
        </div>
    );
};