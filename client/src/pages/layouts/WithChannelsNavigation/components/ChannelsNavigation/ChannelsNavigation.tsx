import { FC, useRef } from 'react';
import { SpriteImage, Tooltip, OverlayContextProvider, CreateChannelModal, Button, Conditional, Separator, ContextMenu, Scrollable, FindChannelModal, ChannelAvatar, List, Ref , MoveFocusInside, ToDo } from '@components';
import { WrapperWithBullet } from './components';
import { useKeyboardNavigation, useNavigator } from '@hooks';
import { twClassNames } from '@utils';
import { useMemoSelector } from '@redux/hooks';
import { AppSelectors, ChannelSelectors } from '@redux/features';
import { RootState } from '@redux/store';



const styles = {
    wrapper: 'h-screen w-[72px] flex flex-col gap-2 shrink-0 py-2 bg-primary-500',
    scrollbar: 'grow-0',
    button: {
        base: `w-12 h-12 mx-auto flex justify-center items-center bg-primary-300 
        rounded-3xl overflow-hidden transition-all ease-linear duration-75
        hover:rounded-2xl focus-visible:rounded-2xl hover:text-white 
        focus-visible:text-white peer`,
        active: 'rounded-2xl text-white',
    },
    channelAvatar: 'w-full h-full rounded-none',
    icon: 'w-7 h-7 transition-all ease-linear duration-75',
    actionButton: {
        base: `hover:bg-positive focus-visible:bg-positive 
        fill-positive hover:fill-white focus-visible:fill-white`,
        active: 'bg-positive fill-white',
    },
    brandButton: {
        base: `hover:bg-brand focus-visible:bg-brand 
        fill-icon-200 hover:fill-white focus-visible:fill-white`,
        active: 'bg-brand fill-white',
    },
    list: 'flex flex-col gap-2',
    separator: 'w-1/2',
};

export const ChannelsNavigation: FC = () => {
    const { myLocationIs, navigateTo } = useNavigator();
    const ids = useMemoSelector((s: RootState) => AppSelectors.selectMe(s).channels);
    const channels = useMemoSelector(ChannelSelectors.selectByIds(ids), [ids]);
    const channelsRef = useRef(channels);
    const {
        getIsFocused,
        getTabIndex,
        setRoot,
        withFocusSet,
    } = useKeyboardNavigation(channelsRef);

    const showChannels = !!channels.length;
    const isInAppOrPrivateChatPage = myLocationIs.app() || myLocationIs.anyPrivateChat();

    return (
        <div className={styles.wrapper}>
            <WrapperWithBullet isActive={isInAppOrPrivateChatPage}>
                <Ref<HTMLButtonElement>>
                    {(ref) => (
                        <>
                            <Button
                                className={twClassNames(
                                    styles.button.base,
                                    styles.brandButton.base,
                                    {
                                        [styles.button.active]: isInAppOrPrivateChatPage,
                                        [styles.brandButton.active]: isInAppOrPrivateChatPage,
                                    },
                                )}
                                innerRef={ref}
                                isActive={isInAppOrPrivateChatPage}
                                label='Перейти на главную страницу'
                                onLeftClick={() => navigateTo.app()}
                            >
                                <SpriteImage
                                    className={styles.icon}
                                    name='DISCORD_LOGO'
                                />
                            </Button>

                            <Tooltip
                                preferredAlignment='right'
                                leaderElementRef={ref}
                            >
                                <>Главная страница</>
                            </Tooltip>
                        </>
                    )}
                </Ref>
            </WrapperWithBullet>

            <Conditional isRendered={showChannels}>
                <Separator className={styles.separator} spacing={0}/>
            </Conditional>

            <Scrollable className={styles.scrollbar} hidden followContentSize>
                <Conditional isRendered={showChannels}>
                    <ul
                        className={styles.list}
                        tabIndex={0}
                        aria-label='Список каналов'
                        ref={setRoot}
                    >
                        <List list={channels}>
                            {(channel) => {
                                const isInChannel = myLocationIs.channel(channel.id);
                                const handleNavigateToChannel = () => navigateTo.channel(channel.id);

                                return (
                                    <li>
                                        <MoveFocusInside enabled={getIsFocused(channel.id)}>
                                            <WrapperWithBullet isActive={isInChannel}>
                                                <Ref<HTMLButtonElement>>
                                                    {(ref) => (
                                                        <>
                                                            <Button
                                                                className={twClassNames(
                                                                    styles.button.base,
                                                                    styles.brandButton.base,
                                                                    {
                                                                        [styles.button.active]: isInChannel,
                                                                        [styles.brandButton.active]: isInChannel,
                                                                    },
                                                                )}
                                                                tabIndex={getTabIndex(channel.id)}
                                                                label={channel.name}
                                                                innerRef={ref}
                                                                onLeftClick={withFocusSet(channel.id, handleNavigateToChannel)}
                                                                onAnyClick={withFocusSet(channel.id)}
                                                            >
                                                                <ChannelAvatar
                                                                    className={styles.channelAvatar}
                                                                    avatar={channel.avatar}
                                                                    name={channel.name}
                                                                />
                                                            </Button>

                                                            <Tooltip
                                                                preferredAlignment='right'
                                                                leaderElementRef={ref}
                                                            >
                                                                <>{channel.name}</>
                                                            </Tooltip>

                                                            <OverlayContextProvider>
                                                                <ToDo>
                                                                    <ContextMenu
                                                                        preferredAlignment='right'
                                                                        leaderElementRef={ref}
                                                                    >

                                                                        <>menu</>

                                                                        <Button>
                                                                            <>1</>
                                                                        </Button>

                                                                        <Button>
                                                                            <>2</>
                                                                        </Button>
                                                                    </ContextMenu>
                                                                </ToDo>
                                                            </OverlayContextProvider>
                                                        </>
                                                    )}
                                                </Ref>
                                            </WrapperWithBullet>
                                        </MoveFocusInside>
                                    </li>
                                );
                            }}
                        </List>
                    </ul>
                </Conditional>
            </Scrollable>

            <Conditional isRendered={showChannels}>
                <Separator className={styles.separator} spacing={0}/>
            </Conditional>

            <OverlayContextProvider>
                {({ openOverlay, isOverlayExist }) => (
                    <WrapperWithBullet isActive={isOverlayExist}>
                        <Ref<HTMLButtonElement>>
                            {(ref) => (
                                <>
                                    <Button
                                        className={twClassNames(
                                            styles.button.base,
                                            styles.actionButton.base,
                                            {
                                                [styles.button.active]: isOverlayExist,
                                                [styles.actionButton.active]: isOverlayExist,
                                            },
                                        )}
                                        hasPopup='dialog'
                                        isActive={isOverlayExist}
                                        label='Найти публичный канал'
                                        innerRef={ref}
                                        onLeftClick={openOverlay}
                                    >
                                        <SpriteImage
                                            className={styles.icon}
                                            name='NAVIGATOR_ICON'
                                        />
                                    </Button>

                                    <FindChannelModal/>

                                    <Tooltip
                                        preferredAlignment='right'
                                        leaderElementRef={ref}
                                    >
                                        <>Найти публичный канал</>
                                    </Tooltip>
                                </>
                            )}
                        </Ref>
                    </WrapperWithBullet>
                )}
            </OverlayContextProvider>

            <OverlayContextProvider>
                {({ openOverlay, isOverlayExist }) => (
                    <WrapperWithBullet isActive={isOverlayExist}>
                        <Ref<HTMLButtonElement>>
                            {(ref) => (
                                <>
                                    <Button
                                        className={twClassNames(
                                            styles.button.base,
                                            styles.actionButton.base,
                                            {
                                                [styles.button.active]: isOverlayExist,
                                                [styles.actionButton.active]: isOverlayExist,
                                            },
                                        )}
                                        hasPopup='dialog'
                                        isActive={isOverlayExist}
                                        label='Добавить канал'
                                        innerRef={ref}
                                        onLeftClick={openOverlay}
                                    >
                                        <SpriteImage
                                            className={styles.icon}
                                            name='ADD_CHANNEL_NAVIGATION_ICON'
                                        />
                                    </Button>

                                    <CreateChannelModal/>

                                    <Tooltip
                                        preferredAlignment='right'
                                        leaderElementRef={ref}
                                    >
                                        <>Добавить канал</>
                                    </Tooltip>
                                </>
                            )}
                        </Ref>
                    </WrapperWithBullet>
                )}
            </OverlayContextProvider>
        </div>
    );
};