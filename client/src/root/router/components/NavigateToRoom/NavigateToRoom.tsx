import { EntityContext } from '@components';
import { useNavigator } from '@hooks';
import { HelperApi } from '@redux/features';
import { FC, ReactNode, useContext, useEffect } from 'react';



type NavigateToRoom = {
    loader: ReactNode;
    fallback: ReactNode;
}

export const NavigateToRoom: FC<NavigateToRoom> = ({
    loader,
    fallback,
}) => {
    const { navigateTo } = useNavigator();
    const channel = useContext(EntityContext.Channel);
    const [getRoomIds, { data, isUninitialized }] = HelperApi.useHelperGetAvailableTextRoomIdsMutation();

    const showLoader = !data;
    const showFallback = !!data && !data.length;

    useEffect(() => {
        if (!channel?.id) return;
        if (!isUninitialized) return;
        if (data) return;

        getRoomIds({ channelId: channel.id });
    }, [data, channel, getRoomIds, isUninitialized]);

    useEffect(() => {
        if (!channel?.id) return;
        if (!data) return;
        if (!data.length) return;

        const roomToNavigate = data[0];

        navigateTo.room(channel.id, roomToNavigate);
    }, [channel?.id, data, navigateTo]);

    return (
        <>
            <If condition={showLoader}>
                {loader}
            </If>

            <If condition={showFallback}>
                {fallback}
            </If>
        </>
    );
};