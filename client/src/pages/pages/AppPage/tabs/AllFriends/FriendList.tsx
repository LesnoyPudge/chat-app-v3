import { FC, useMemo } from 'react';
import { IUserPreview } from '@backendTypes';
import { useNavigator } from '@hooks';
import { ActionButton, List, ListHeading, ListItem } from '../components';
import { Conditional } from '@components';



interface IFriendList {
    filterValue: string;
    friends: IUserPreview[];
}

export const FriendList: FC<IFriendList> = ({ filterValue, friends }) => {
    const { navigateTo } = useNavigator();

    const filtredFriends = useMemo(() => {
        return filterValue 
            ? friends.filter((friend) => friend.username.match(filterValue)) 
            : friends;
    }, [filterValue, friends]);

    const isFiltred = friends.length - filtredFriends.length !== 0;

    return (
        <>
            <ListHeading>
                <>Всего друзей — {friends.length}</>
                
                <Conditional isRendered={isFiltred}>
                    <> Показано — {filtredFriends.length}</>
                </Conditional>
            </ListHeading>

            <List>
                {
                    filtredFriends.map(({ id, avatar, username, status, extraStatus }) => {
                        const handleNavigate = () => navigateTo.privateChat(id);
                        
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
                                            iconClassName='group-1-hover:fill-red
                                            group-1-focus-visible:fill-red'
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