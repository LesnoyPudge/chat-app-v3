import { Scrollable, List, EntityContextProvider, MoveFocusInside, ChildrenAsNodeOrFunction } from '@components';
import { PropsWithChildrenAsNodeOrFunction, SliceEntityState } from '@types';
import { FC } from 'react';
import { WrapperWithBullet } from '../WrapperWithBullet';
import { useNavigator, useLatest, useKeyboardNavigation } from '@hooks';
import { AppSelectors, ChannelSelectors } from '@redux/features';
import { useMemoSelector } from '@redux/hooks';
import { RootState } from '@redux/store';
import { AnyFunction } from 'ts-essentials';



type ChildrenArgs = [
    id: string,
    channel: SliceEntityState.Channel | undefined,
    isInChannel: boolean,
    navigateToChannel: AnyFunction,
    keyboardNavigation: ReturnType<typeof useKeyboardNavigation>
];

const styles = {
    scrollbar: 'grow-0',
    list: 'flex flex-col gap-2',
};

export const ChannelList: FC<PropsWithChildrenAsNodeOrFunction<ChildrenArgs>> = ({
    children,
}) => {
    const { myLocationIs, navigateTo } = useNavigator();
    const ids = useMemoSelector((s: RootState) => AppSelectors.selectMe(s).channels);
    const channels = useMemoSelector(ChannelSelectors.selectByIds(ids), [ids]);
    const channelsRef = useLatest(channels);
    const keyboardNavigation = useKeyboardNavigation(channelsRef);

    return (
        <Scrollable className={styles.scrollbar} hidden followContentSize>
            <ul
                className={styles.list}
                tabIndex={0}
                aria-label='Список каналов'
                ref={keyboardNavigation.setRoot}
            >
                <List list={ids}>
                    {(channelId) => (
                        <EntityContextProvider.Channel id={channelId}>
                            {(channel) => {
                                const isInChannel = myLocationIs.channel(channelId);
                                const navigateToChannel = () => navigateTo.channel(channelId);

                                const childrenArgs: ChildrenArgs = [
                                    channelId,
                                    channel,
                                    isInChannel,
                                    navigateToChannel,
                                    keyboardNavigation,
                                ];

                                return (
                                    <li>
                                        <MoveFocusInside enabled={keyboardNavigation.getIsFocused(channelId)}>
                                            <WrapperWithBullet isActive={isInChannel}>
                                                <ChildrenAsNodeOrFunction args={childrenArgs}>
                                                    {children}
                                                </ChildrenAsNodeOrFunction>
                                            </WrapperWithBullet>
                                        </MoveFocusInside>
                                    </li>
                                );
                            }}
                        </EntityContextProvider.Channel>
                    )}
                </List>
            </ul>
        </Scrollable>
    );
};