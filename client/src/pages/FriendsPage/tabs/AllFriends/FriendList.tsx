import { FC, Fragment, useMemo } from 'react';
import { IUserPreview } from '@backendTypes';
import { ActionButton, List, ListHeading, ListItem } from '../../components';
import { useNavigateTo } from '@hooks';



interface IFriendList {
    filterValue: string;
    friends: IUserPreview[];
}

export const FriendList: FC<IFriendList> = ({ filterValue, friends }) => {
    const { navigateToPrivateChat } = useNavigateTo();

    const filtredFriends = useMemo(() => {
        return filterValue 
            ? friends.filter((friend) => friend.username.match(filterValue)) 
            : friends;
    }, [filterValue, friends]);

    const isFiltred = friends.length - filtredFriends.length !== 0;

    return (
        <>
            <ListHeading 
                isFiltred={isFiltred}
                filtredListlength={filtredFriends.length}
            >
                Всего друзей — {friends.length}
            </ListHeading>

            <List>
                {
                    filtredFriends.map(({ id, avatar, username, status, extraStatus }) => {
                        const handleNavigate = () => navigateToPrivateChat({ privateChatId: id });
                        
                        return (
                            <ListItem
                                key={id}
                                avatar={avatar}
                                username={username}
                                status={status}
                                extraStatus={extraStatus}
                                extraInfo=''
                                actionButtons={
                                    <>
                                        <ActionButton 
                                            buttonClassName='ml-auto'
                                            iconId='message-bubble-icon' 
                                            tooltipContent='Написать сообщение'
                                            onClick={handleNavigate}
                                        />

                                        <ActionButton
                                            buttonClassName='ml-2'
                                            iconClassName='group-2-hover:fill-red
                                            group-2-focus-visible:fill-red'
                                            iconId='garbage-can-icon'
                                            tooltipContent='Удалить из друзей'
                                            onClick={() => {console.log('delete friend');}}
                                        />
                                    </>
                                }
                            />
                        );
                    })
                }
            </List>
        </>
    );
};