import { FC, useRef } from 'react';
import { SpriteImage, Tooltip, OverlayContextProvider, CreateChannelModal, Button, Separator, ContextMenu, FindChannelModal, ChannelAvatar, Ref, ToDo, FocusInside } from '@components';
import { ChannelList, WrapperWithBullet } from './components';
import { useNavigator } from '@hooks';
import { cn, getReadImagePath, getTextFallback, twClassNames } from '@utils';
import { useMemoSelector, useMemoSelectorV2 } from '@redux/hooks';
import { AppSelectors } from '@redux/features';



const styles = {
    wrapper: {
        base: 'h-dvh w-[72px] flex flex-col gap-2 shrink-0 py-2 bg-primary-500',
        hidden: 'hidden',
    },
    button: {
        base: `w-12 h-12 mx-auto flex justify-center items-center bg-primary-300 
        rounded-3xl overflow-hidden transition-all ease-linear duration-75
        hover:rounded-2xl focus-visible:rounded-2xl hover:text-white 
        focus-visible:text-white data-[loading=true]:animate-pulse peer`,
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
    separator: 'w-1/2',
};

export const ChannelsNavigation: FC = () => {
    const { myLocationIs, navigateTo } = useNavigator();
    const showChannels = useMemoSelector((s) => !!AppSelectors.selectMe(s).channels.length, []);
    const isInAppOrPrivateChatSubPage = myLocationIs.app() || myLocationIs.anyPrivateChat();
    const { isMobileContentShown } = useMemoSelectorV2(AppSelectors.isMobileContentShown)
    const { isMobileMenuShown } = useMemoSelectorV2(AppSelectors.isMobileMenuShown)
    const wrapperRef = useRef<HTMLDivElement>(null)

    return (
        <FocusInside
            focused={isMobileMenuShown}
            providedRef={wrapperRef}
        >
            <div 
                className={cn(styles.wrapper.base, {
                    [styles.wrapper.hidden]: isMobileContentShown
                })}
                ref={wrapperRef}
            >
                <WrapperWithBullet isActive={isInAppOrPrivateChatSubPage}>
                    <Ref<HTMLButtonElement>>
                        {(ref) => (
                            <>
                                <Button
                                    className={twClassNames(
                                        styles.button.base,
                                        styles.brandButton.base,
                                        {
                                            [styles.button.active]: isInAppOrPrivateChatSubPage,
                                            [styles.brandButton.active]: isInAppOrPrivateChatSubPage,
                                        },
                                    )}
                                    innerRef={ref}
                                    isActive={isInAppOrPrivateChatSubPage}
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

                <If condition={showChannels}>
                    <Separator className={styles.separator} spacing={0}/>
                </If>

                <If condition={showChannels}>
                    <ChannelList>
                        {(
                            channelId,
                            channel,
                            isInChannel,
                            navigateToChannel,
                            { getTabIndex, withFocusSet },
                        ) => (
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
                                            tabIndex={getTabIndex(channelId)}
                                            label={getTextFallback(channel?.name)}
                                            isLoading={!channel}
                                            isActive={isInChannel}
                                            innerRef={ref}
                                            onLeftClick={withFocusSet(channelId, navigateToChannel)}
                                            onAnyClick={withFocusSet(channelId)}
                                        >
                                            <ChannelAvatar
                                                className={styles.channelAvatar}
                                                avatar={getReadImagePath(channel?.avatar)}
                                                name={channel?.name}
                                            />
                                        </Button>

                                        <Tooltip
                                            preferredAlignment='right'
                                            leaderElementRef={ref}
                                        >
                                            <>{getTextFallback(channel?.name)}</>
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
                        )}
                    </ChannelList>
                </If>

                <If condition={showChannels}>
                    <Separator className={styles.separator} spacing={0}/>
                </If>

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
        </FocusInside>
    );
};