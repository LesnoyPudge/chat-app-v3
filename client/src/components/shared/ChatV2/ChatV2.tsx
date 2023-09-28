import { FC, useContext } from 'react';
import { EntityContext, EntityContextHelpers, LoadedEntityContext, MessageEditor } from '@components';
import { PropsWithClassName, SliceEntityState } from '@types';
import { ChatSelectors, PrivateChannelSelectors, UserSelectors } from '@redux/features';
import { useMemoSelector } from '@redux/hooks';
import { MessageFeed, MessageInputBar } from './components';
import { useEntitySubscription } from '@hooks';
import { SUBSCRIBABLE_ENTITIES } from '../../../../../shared/vars';



const styles = {
    messageInputBar: 'px-4 pt-4 pb-6',
};

const RoomChat: FC<PropsWithClassName> = ({
    className = '',
}) => {
    const [chat] = useContext(EntityContext.Chat);
    const hasAccessToRoomChat = useMemoSelector(
        ChatSelectors.selectHasAccessToRoomChat(chat?.id),
        [chat?.id],
    );

    return (
        <div className={className}>
            <MessageFeed/>

            <EntityContextHelpers.Chat.Loading>
                <MessageEditor.Placeholder className={styles.messageInputBar}/>
            </EntityContextHelpers.Chat.Loading>

            <EntityContextHelpers.Chat.Loaded>
                <If condition={!hasAccessToRoomChat}>
                    <MessageEditor.Disabled className={styles.messageInputBar}>
                        <>У вас недостаточно прав, чтобы отправлять сообщения в этой комнате.</>
                    </MessageEditor.Disabled>
                </If>

                <If condition={hasAccessToRoomChat}>
                    <MessageInputBar className={styles.messageInputBar}/>
                </If>
            </EntityContextHelpers.Chat.Loaded>
        </div>
    );
};

const PrivateChannelChat: FC<PropsWithClassName> = ({
    className = '',
}) => {
    const [privateChannel] = useContext(EntityContext.PrivateChannel);

    const secondMemberIdArr = useMemoSelector((state) => {
        const id = PrivateChannelSelectors.selectSecondMemberId(privateChannel?.id)(state);
        return id ? [id] : undefined;
    }, [privateChannel?.id]);

    const [chat] = useContext(EntityContext.Chat);
    const secondMember = useEntitySubscription<SliceEntityState.User>(
        SUBSCRIBABLE_ENTITIES.USER,
        secondMemberIdArr,
    ).at(0);

    const isBlockedByMe = useMemoSelector(UserSelectors.selectIsBlockedByMe(
        secondMemberIdArr?.at(0),
    ), [secondMemberIdArr]);

    const amIBlocked = useMemoSelector(UserSelectors.selectAmIBlocked(
        secondMemberIdArr?.at(0),
    ), [secondMemberIdArr]);

    const isLoading = !chat || !secondMember;
    const showPlaceholderBar = isLoading;
    const showBlockedBar = !showPlaceholderBar && isBlockedByMe;
    const showDisabledBar = !showPlaceholderBar && (amIBlocked && !showBlockedBar);
    const showReadyBar = !showPlaceholderBar && (!isBlockedByMe && !amIBlocked);

    return (
        <div className={className}>
            <MessageFeed/>

            <If condition={showPlaceholderBar}>
                <MessageEditor.Placeholder className={styles.messageInputBar}/>
            </If>

            <If condition={showBlockedBar}>
                <MessageEditor.Blocked className={styles.messageInputBar}/>
            </If>

            <If condition={showDisabledBar}>
                <MessageEditor.Disabled className={styles.messageInputBar}>
                    <>Вы заблокированы</>
                </MessageEditor.Disabled>
            </If>

            <If condition={showReadyBar}>
                <MessageInputBar className={styles.messageInputBar}/>
            </If>
        </div>
    );
};

export const ChatV3 = {
    Room: RoomChat,
    PrivateChannel: PrivateChannelChat,
};


export const ChatV2: FC<PropsWithClassName> = ({
    className = '',
}) => {
    const [chat] = useContext(EntityContext.Chat);

    const isInRoom = !!chat?.owner && chat.owner === 'Room';
    const isInPrivateChannel = !!chat?.owner && chat.owner === 'PrivateChannel';

    // const IsAbleToSendMessage = useMemoSelector(ChatSelectors.selectIsAbleToSendMessage(chat?.id));

    const disabledText = (
        isInRoom
            ? 'У вас недостаточно прав, чтобы отправлять сообщения в этой комнате.'
            : 'Вы заблокированы'
    );

    // const placeholderText = (
    //     chat?.owner
    //         ? chat.owner === 'Room'
    //             ? 'У вас недостаточно прав для отправки сообщения'
    //             : 'Вы заблокированы'
    //         : ''
    // );

    return (
        <div>
            <div>
                <>message feed</>
            </div>

            <EntityContextHelpers.Chat.Loading>
                <MessageEditor.Placeholder className={styles.messageInputBar}/>
            </EntityContextHelpers.Chat.Loading>

            <EntityContextHelpers.Chat.Loaded>
                {({ owner }) => (
                    <>
                        <If condition={owner === 'Room'}>

                        </If>
                    </>
                )}
            </EntityContextHelpers.Chat.Loaded>
        </div>
    );
};

const RoomInput: FC = () => {
    return (
        <>
        </>
    );
};

const PrivateChannelInput: FC = () => {
    const [chat] = useContext(LoadedEntityContext.Chat);
    // const qwe = useMemoSelector(UserSelectors.isBlockedByMe());


    return (
        <>
        </>
    );
};