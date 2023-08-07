import { FC, useRef } from 'react';
import { SpriteImage, Tooltip, OverlayContextProvider, CreateChannelModal, Button, Conditional, Separator, ContextMenu, Scrollable, FindChannelModal, ChannelAvatar, List, Ref , MoveFocusInside } from '@components';
import { WrapperWithBullet } from './components';
import { useKeyboardNavigation, useNavigator } from '@hooks';
import { twClassNames } from '@utils';




const channels = [
    { avatar: 'https://i.pravatar.cc/80', id: '1asd', name: 'amazing channel', rooms: [{ id: '1' }] },
    { avatar: 'https://i.pravatar.cc/81', id: '2yk', name: 'wow', rooms: [{ id: '2' }] },
    { avatar: '', id: '3eh', name: 'first', rooms: [{ id: '2' }] },
    { avatar: '', id: '4tu.', name: '2', rooms: [{ id: '2' }] },
    { avatar: 'https://i.pravatar.cc/82', id: '5szb', name: '3', rooms: [{ id: '2' }] },
    { avatar: '', id: '6tru', name: '4', rooms: [{ id: '2' }] },
    { avatar: '', id: '7nfk', name: '5', rooms: [{ id: '2' }] },
    { avatar: '', id: '8f.', name: '6', rooms: [{ id: '2' }] },
    { avatar: '', id: '9aerg', name: '7', rooms: [{ id: '2' }] },
    { avatar: 'https://i.pravatar.cc/83', id: '10uik', name: '8', rooms: [{ id: '2' }] },
    { avatar: '', id: '11ou;', name: '9', rooms: [{ id: '2' }] },
    { avatar: 'https://i.pravatar.cc/84', id: '12wfEGA', name: '1 0', rooms: [{ id: '2' }] },
    { avatar: 'https://i.pravatar.cc/85', id: '13tyhd', name: '1 1', rooms: [{ id: '2' }] },
    { avatar: '', id: '14zfbv', name: '1 2', rooms: [{ id: '2' }] },
    { avatar: '', id: '15sryth', name: '1 3', rooms: [{ id: '2' }] },
    { avatar: '', id: '16gra', name: '1 4 4 56 78 8', rooms: [{ id: '2' }] },
    { avatar: '', id: '17tyjtjd', name: 'last', rooms: [{ id: '2' }] },
];

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
    const isInAppOrPrivateChatPage = myLocationIs.app() || myLocationIs.anyPrivateChat();
    const showChannels = !!channels.length;

    const channelsRef = useRef(channels);
    const {
        getIsFocused,
        getTabIndex,
        setRoot,
        withFocusSet,
    } = useKeyboardNavigation(channelsRef);

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
                                                            <ContextMenu
                                                                preferredAlignment='right'
                                                                leaderElementRef={ref}
                                                                withContextMenuHandler
                                                            >
                                                                <>menu</>
                                                            </ContextMenu>
                                                        </OverlayContextProvider>
                                                    </>
                                                )}
                                            </Ref>
                                        </WrapperWithBullet>
                                    </MoveFocusInside>
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



// const styles = {
//     wrapper: 'h-screen w-[72px] shrink-0 bg-primary-500',
//     scrollbar: 'h-full',
//     inner: 'flex flex-col gap-2',
//     button: {
//         base: `w-12 h-12 mx-auto flex justify-center items-center bg-primary-300
//         rounded-3xl overflow-hidden transition-all ease-linear duration-75
//         hover:rounded-2xl focus-visible:rounded-2xl hover:text-white
//         focus-visible:text-white peer`,
//         active: 'rounded-2xl text-white',
//     },
//     channelAvatar: 'w-full h-full rounded-none',
//     icon: 'w-7 h-7 transition-all ease-linear duration-75',
//     actionButton: {
//         base: `hover:bg-positive focus-visible:bg-positive
//         fill-positive hover:fill-white focus-visible:fill-white`,
//         active: 'bg-positive fill-white',
//     },
//     brandButton: {
//         base: `hover:bg-brand focus-visible:bg-brand
//         fill-icon-200 hover:fill-white focus-visible:fill-white`,
//         active: 'bg-brand fill-white',
//     },
//     list: 'flex flex-col gap-2',
//     separator: 'w-1/2',
//     sticky: 'grid gap-2 sticky z-10 bg-primary-500',
//     header: 'top-0 pt-3',
//     footer: 'bottom-0 pb-3',
// };

// export const ChannelsNavigation: FC = () => {
//     const { myLocationIs, navigateTo } = useNavigator();
//     const isInAppOrPrivateChatPage = myLocationIs.app() || myLocationIs.anyPrivateChat();
//     const showChannels = !!channels.length;

//     const channelsRef = useRef(channels);
//     const {
//         getIsFocused,
//         getTabIndex,
//         setRoot,
//         withFocusSet,
//     } = useKeyboardNavigation(channelsRef);

//     return (
//         <div className={styles.wrapper}>
//             <Scrollable className={styles.scrollbar} hidden>
//                 <div className={styles.inner}>
//                     <div className={twClassNames(styles.sticky, styles.header)} >
//                         <WrapperWithBullet isActive={isInAppOrPrivateChatPage}>
//                             <Ref<HTMLButtonElement>>
//                                 {(ref) => (
//                                     <>
//                                         <Button
//                                             className={twClassNames(
//                                                 styles.button.base,
//                                                 styles.brandButton.base,
//                                                 {
//                                                     [styles.button.active]: isInAppOrPrivateChatPage,
//                                                     [styles.brandButton.active]: isInAppOrPrivateChatPage,
//                                                 },
//                                             )}
//                                             innerRef={ref}
//                                             label='Перейти на главную страницу'
//                                             onLeftClick={() => navigateTo.app()}
//                                         >
//                                             <SpriteImage
//                                                 className={styles.icon}
//                                                 name='discord-logo'
//                                             />
//                                         </Button>

//                                         <Tooltip
//                                             preferredAlignment='right'
//                                             leaderElementRef={ref}
//                                         >
//                                             <>Главная страница</>
//                                         </Tooltip>
//                                     </>
//                                 )}
//                             </Ref>
//                         </WrapperWithBullet>

//                         <Conditional isRendered={showChannels}>
//                             <Separator className={styles.separator} spacing={0}/>
//                         </Conditional>
//                     </div>

//                     <Conditional isRendered={showChannels}>
//                         <ul
//                             className={styles.list}
//                             tabIndex={0}
//                             aria-label='Список каналов'
//                             ref={setRoot}
//                         >
//                             <List list={channels}>
//                                 {(channel) => {
//                                     const isInChannel = myLocationIs.channel(channel.id);
//                                     const handleNavigateToChannel = () => navigateTo.channel(channel.id);

//                                     return (
//                                         <MoveFocusInside enabled={getIsFocused(channel.id)}>
//                                             <WrapperWithBullet isActive={isInChannel}>
//                                                 <Ref<HTMLButtonElement>>
//                                                     {(ref) => (
//                                                         <>
//                                                             <Button
//                                                                 className={twClassNames(
//                                                                     styles.button.base,
//                                                                     styles.brandButton.base,
//                                                                     {
//                                                                         [styles.button.active]: isInChannel,
//                                                                         [styles.brandButton.active]: isInChannel,
//                                                                     },
//                                                                 )}
//                                                                 tabIndex={getTabIndex(channel.id)}
//                                                                 label={channel.name}
//                                                                 innerRef={ref}
//                                                                 onLeftClick={withFocusSet(channel.id, handleNavigateToChannel)}
//                                                             >
//                                                                 <ChannelAvatar
//                                                                     className={styles.channelAvatar}
//                                                                     avatar={channel.avatar}
//                                                                     name={channel.name}
//                                                                 />
//                                                             </Button>

//                                                             <Tooltip
//                                                                 preferredAlignment='right'
//                                                                 leaderElementRef={ref}
//                                                             >
//                                                                 <>{channel.name}</>
//                                                             </Tooltip>

//                                                             <OverlayContextProvider>
//                                                                 <ContextMenu
//                                                                     preferredAlignment='right'
//                                                                     leaderElementRef={ref}
//                                                                     withContextMenuHandler
//                                                                 >
//                                                                     <>menu</>
//                                                                 </ContextMenu>
//                                                             </OverlayContextProvider>
//                                                         </>
//                                                     )}
//                                                 </Ref>
//                                             </WrapperWithBullet>
//                                         </MoveFocusInside>
//                                     );
//                                 }}
//                             </List>
//                         </ul>
//                     </Conditional>

//                     <div className={twClassNames(styles.sticky, styles.footer)}>
//                         <Conditional isRendered={showChannels}>
//                             <Separator className={styles.separator} spacing={0}/>
//                         </Conditional>

//                         <OverlayContextProvider>
//                             {({ openOverlay, isOverlayExist }) => (
//                                 <WrapperWithBullet isActive={isOverlayExist}>
//                                     <Ref<HTMLButtonElement>>
//                                         {(ref) => (
//                                             <>
//                                                 <Button
//                                                     className={twClassNames(
//                                                         styles.button.base,
//                                                         styles.actionButton.base,
//                                                         {
//                                                             [styles.button.active]: isOverlayExist,
//                                                             [styles.actionButton.active]: isOverlayExist,
//                                                         },
//                                                     )}
//                                                     hasPopup='dialog'
//                                                     isActive={isOverlayExist}
//                                                     label='Найти публичный канал'
//                                                     innerRef={ref}
//                                                     onLeftClick={openOverlay}
//                                                 >
//                                                     <SpriteImage
//                                                         className={styles.icon}
//                                                         name='navigator-icon'
//                                                     />
//                                                 </Button>

//                                                 <FindChannelModal/>

//                                                 <Tooltip
//                                                     preferredAlignment='right'
//                                                     leaderElementRef={ref}
//                                                 >
//                                                     <>Найти публичный канал</>
//                                                 </Tooltip>
//                                             </>
//                                         )}
//                                     </Ref>
//                                 </WrapperWithBullet>
//                             )}
//                         </OverlayContextProvider>

//                         <OverlayContextProvider>
//                             {({ openOverlay, isOverlayExist }) => (
//                                 <WrapperWithBullet isActive={isOverlayExist}>
//                                     <Ref<HTMLButtonElement>>
//                                         {(ref) => (
//                                             <>
//                                                 <Button
//                                                     className={twClassNames(
//                                                         styles.button.base,
//                                                         styles.actionButton.base,
//                                                         {
//                                                             [styles.button.active]: isOverlayExist,
//                                                             [styles.actionButton.active]: isOverlayExist,
//                                                         },
//                                                     )}
//                                                     hasPopup='dialog'
//                                                     isActive={isOverlayExist}
//                                                     label='Добавить канал'
//                                                     innerRef={ref}
//                                                     onLeftClick={openOverlay}
//                                                 >
//                                                     <SpriteImage
//                                                         className={styles.icon}
//                                                         name='add-channel-navigation-icon'
//                                                     />
//                                                 </Button>

//                                                 <CreateChannelModal/>

//                                                 <Tooltip
//                                                     preferredAlignment='right'
//                                                     leaderElementRef={ref}
//                                                 >
//                                                     <>Добавить канал</>
//                                                 </Tooltip>
//                                             </>
//                                         )}
//                                     </Ref>
//                                 </WrapperWithBullet>
//                             )}
//                         </OverlayContextProvider>
//                     </div>
//                 </div>
//             </Scrollable>
//         </div>
//     );
// };