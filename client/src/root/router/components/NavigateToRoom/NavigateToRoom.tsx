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
    const [_, id] = useContext(EntityContext.Channel);
    const [getRoomIds, { data, isUninitialized }] = HelperApi.useHelperGetAvailableTextRoomIdsMutation();

    const showLoader = !data;
    const showFallback = !!data && !data.length;

    useEffect(() => {
        if (!isUninitialized) return;
        if (data) return;

        getRoomIds({ channelId: id });
    }, [data, id, getRoomIds, isUninitialized]);

    useEffect(() => {
        if (!data) return;
        if (!data.length) return;

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