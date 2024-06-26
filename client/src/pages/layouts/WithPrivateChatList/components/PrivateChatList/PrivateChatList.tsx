import { ExtraStatusType, StatusType } from '@backendTypes';
import { List, Scrollable , MoveFocusInside } from '@components';
import { useKeyboardNavigation } from '@hooks';
import { Heading } from '@libs';
import { FC, useRef } from 'react';

import { PrivateChatItem } from './components';



interface PrivateChats {
    id: string;
    username: string;
    avatar: string;
    status: StatusType;
    extraStatus: ExtraStatusType;
}

const privateChats: PrivateChats[] = [
    {
        id: '1',
        username: 'friend 1 qweqweqweqweqweqweqweqweqweqweqweqweqweqwwew',
        avatar: 'https://i.pravatar.cc/51',
        status: 'online',
        extraStatus: 'default',
    },
];

const styles = {
    section: 'flex flex-col h-full mt-6',
    heading: 'mx-3.5 mb-4 uppercase font-semibold text-xs text-color-base',
    list: 'flex flex-col gap-[3px] pt-1 pb-4',
};

export const PrivateChatList: FC = () => {
    const privateChatsRef = useRef(privateChats);
    const {
        getIsFocused,
        getTabIndex,
        setRoot,
        withFocusSet,
    } = useKeyboardNavigation(privateChatsRef);

    return (
        <div className={styles.section}>
            <Heading className={styles.heading}>
                <>Личные сообщения</>
            </Heading>

            <Scrollable
                withOppositeGutter
                autoHide
                small
            >
                <ul
                    className={styles.list}
                    tabIndex={0}
                    aria-label='Список приватных сообщений'
                    ref={setRoot}
                >
                    <List list={privateChats}>
                        {(privateChat) => (
                            <li key={privateChat.id}>
                                <MoveFocusInside enabled={getIsFocused(privateChat.id)}>
                                    <PrivateChatItem
                                        privateChat={privateChat}
                                        tabIndex={getTabIndex(privateChat.id)}
                                        withFocusSet={withFocusSet}
                                    />
                                </MoveFocusInside>
                            </li>
                        )}
                    </List>
                </ul>
            </Scrollable>
        </div>
    );
};