import { ExtraStatusType, StatusType } from '@backendTypes';
import { UserAvatar, RefContextProvider, Button, Icon, Tooltip } from '@components';
import { useNavigator } from '@hooks';
import { twClassNames } from '@utils';
import React, { FC } from 'react';



interface IPrivateChats {
    id: string;
    username: string;
    avatar: string;
    status: StatusType;
    extraStatus: ExtraStatusType;
}

interface IPrivateChatItem {
    privateChat: IPrivateChats;
    tabIndex: number;
}

const styles = {
    wrapper: 'relative group',
    userInfo: {
        base: `flex items-center w-full h-[42px] py-1 pl-2 pr-2
        group-hover:bg-primary-hover group-focus-within:bg-primary-hover
        group-hover:pr-10 group-focus-within:pr-10`,
        active: 'bg-primary-hover pr-10',
    },
    avatar: 'h-8 w-8',
    username: {
        base: `ml-3 font-medium truncated text-start text-color-muted 
        group-hover:text-color-base group-focus-within:text-color-base`,
        active: 'text-color-base',
    },
    hideChatButton: {
        base: `flex absolute top-1/2 -translate-y-1/2 right-2 
        shrink-0 h-7 w-7 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100
        fill-icon-300 hover:fill-icon-100 focus-visible:fill-icon-100`,
        active: 'opacity-100',
    },
    hideChatIcon: 'h-5 w-5 m-auto transition-none',
};

export const PrivateChatItem: FC<IPrivateChatItem> = ({ 
    privateChat,
    tabIndex,
}) => {
    const {
        id,
        avatar,
        username,
        status,
        extraStatus,
    } = privateChat;

    const { navigateTo, myLocationIs } = useNavigator();
    const isActive = myLocationIs.privateChat(id);

    const handleNavigate = () => navigateTo.privateChat(id);
    const handleHideChat = () => console.log('chat hidden');

    return (
        <div className={styles.wrapper}>
            <Button 
                className={twClassNames(
                    styles.userInfo.base,
                    { [styles.userInfo.active]: isActive },
                )}
                onLeftClick={handleNavigate}
                label={`Перейти к личным сообщениям с ${username}`}
                tabIndex={tabIndex}
            >
                <UserAvatar
                    className={styles.avatar}
                    avatar={avatar}
                    username={username}
                    status={status}
                    extraStatus={extraStatus}
                />

                <span 
                    className={twClassNames(
                        styles.username.base,
                        { [styles.username.active]: isActive },
                    )}
                >
                    {username}
                </span>
            </Button>

            <RefContextProvider>
                <Button
                    className={twClassNames(
                        styles.hideChatButton.base,
                        { [styles.hideChatButton.active]: isActive },
                    )}
                    tabIndex={tabIndex}
                    onLeftClick={handleHideChat}
                    label={`Скрыть личные сообщения с ${username}`}
                >
                    <Icon
                        className={styles.hideChatIcon}
                        iconId='cross-icon'
                    />
                </Button>

                <Tooltip preferredAligment='right' spacing={16}>
                    <>Срыть</>
                </Tooltip>
            </RefContextProvider>
        </div>
    );
};