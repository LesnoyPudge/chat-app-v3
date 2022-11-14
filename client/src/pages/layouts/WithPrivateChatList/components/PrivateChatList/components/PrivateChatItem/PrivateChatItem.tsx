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
    listItem: `flex shrink-0 mx-0.5 pl-2 pr-1 h-[42px] items-center 
    rounded-md cursor-pointer hover:bg-hover focus-visible:bg-hover 
    focus-within:bg-hover group`,
    username: `ml-3 font-medium text-muted overflow-hidden
    text-ellipsis whitespace-nowrap group-hover:text-normal 
    group-focus-visible:text-normal group-focus-within:text-normal`,
    hideChatButton: `ml-auto flex shrink-0 h-7 w-7 opacity-0
    group-hover:opacity-100 group-focus-visible:opacity-100 
    group-focus-within:opacity-100 group-1`,
    hideChatButtonIcon: `h-5 w-5 m-auto fill-icon-300 group-1-hover:fill-icon-200
    group-1-focus-visible:fill-icon-200 transition-none'
    iconId='cross-icon`,
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
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.code === 'Enter' || e.code === 'Space') {
            e.preventDefault();
            handleNavigate();
        }
    };

    return (
        <li 
            className={twClassNames(
                styles.listItem, 
                { 'bg-hover' : isActive },
            )}
            tabIndex={tabIndex}
            onClick={handleNavigate}
            onKeyDown={handleKeyDown}
        >
            <UserAvatar
                className='h-8 w-8'
                avatar={avatar}
                username={username}
                status={status}
                extraStatus={extraStatus}
            />

            <span 
                className={twClassNames(
                    styles.username,
                    { 'text-normal': isActive },
                )}
            >
                {username}
            </span>

            <RefContextProvider>
                <Button
                    className={twClassNames(
                        styles.hideChatButton,
                        { 'opacity-100': isActive },
                    )}
                    isntStyled
                    tabIndex={tabIndex}
                    onClick={handleHideChat}
                >
                    <Icon
                        className={styles.hideChatButtonIcon}
                        iconId='cross-icon'
                    />
                </Button>

                <Tooltip position='right' spacing={16}>
                    <>Срыть</>
                </Tooltip>
            </RefContextProvider>
        </li>
    );
};