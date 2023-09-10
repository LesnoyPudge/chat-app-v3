import { EntityContext } from '@components';
import { useLatest, useNavigator } from '@hooks';
import { HelperApi } from '@redux/features';
import { localStorageApi } from '@utils';
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
    const [_, id] = useContext(EntityContext.Channel);
    const [getRoomIds, { data, isUninitialized }] = HelperApi.useHelperGetAvailableTextRoomIdsMutation();
    const lastRoomId = localStorageApi.get('lastVisitedTextRooms')?.[id ?? ''];

    const showLoader = !data;
    const showFallback = !!data && !data.length;

    useEffect(() => {
        if (!isUninitialized) return;
        if (data) return;
        if (!id) return;
        if (lastRoomId) return;

        getRoomIds({ channelId: id });
    }, [data, id, getRoomIds, isUninitialized, lastRoomId]);

    useEffect(() => {
        if (!data) return;
        if (!data.length) return;
        if (!id) return;

        const roomToNavigate = data[0];

        navigateTo.room(id, roomToNavigate);
    }, [id, data, navigateTo]);

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