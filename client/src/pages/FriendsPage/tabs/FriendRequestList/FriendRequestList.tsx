import { FC, useMemo } from 'react';
import { IUserPreview } from '@backendTypes';
import { ActionButton, List, ListHeading, ListItem } from '../../components';



interface IFriendRequestList {
    filterValue: string;
}

const usersMock: IUserPreview[] = [
    {
        id: 'weifoerjf',
        username: 'friend 1',
        avatar: 'https://i.pravatar.cc/51',
        status: 'online',
        extraStatus: 'default',
        isDeleted: false,
    },
    {
        id: 'gewfwfewfes',
        username: 'friend 2',
        avatar: 'https://i.pravatar.cc/52',
        status: 'offline',
        extraStatus: 'afk',
        isDeleted: false,
    },
    {
        id: 'dwqdqqdqqdq',
        username: 'русский ник',
        avatar: 'https://i.pravatar.cc/56',
        status: 'online',
        extraStatus: 'default',
        isDeleted: false,
    },
    {
        id: 'nyntbtbtb',
        username: 'qwdqiheifvieiuehvhevfhuei hvheuivheufvhpe;uhvuefhrpvo;jgirbu ijhd;foibuopi;dfjbopifdo;bipdhjfibgoadf9uvhds[hvsdiobj0[d gfhjfhb[ubughboSDVGCusDGOyvcsIVUHigzfvhiuph',
        avatar: 'https://i.pravatar.cc/57',
        status: 'online',
        extraStatus: 'default',
        isDeleted: false,
    },
];

export const FriendRequestList: FC<IFriendRequestList> = ({ filterValue }) => {
    const users = useMemo(() => usersMock, []) as IUserPreview[];

    const filtredUsers = useMemo(() => {
        return filterValue 
            ? users.filter((user) => user.username.match(filterValue)) 
            : users;
    }, [filterValue, users]);

    const isFiltred = users.length - filtredUsers.length !== 0;

    return (
        <>
            <ListHeading 
                isFiltred={isFiltred}
                filtredListlength={filtredUsers.length}
            >
                Ожидание — {users.length}
            </ListHeading>

            <List>
                {
                    filtredUsers.map(({ id, avatar, username, status, extraStatus }, index) => {
                        const handleUnblock = () => {console.log(`unblock user: ${id}`);};
                        const cond = index % 2 === 0;
                        const extraInfo = cond ? 'Исходящий запрос дружбы' : 'Входящий запрос дружбы';
                    
                        return (
                            <ListItem
                                key={id}
                                avatar={avatar}
                                username={username}
                                status={status}
                                extraStatus={extraStatus}
                                extraInfo={extraInfo}
                                actionButtons={cond
                                    ? <ActionButton 
                                        buttonClassName='ml-auto'
                                        iconClassName='group-2-hover:fill-red
                                        group-2-focus-visible:fill-red'
                                        iconId='cross-icon' 
                                        tooltipContent='Отменить'
                                        onClick={handleUnblock}
                                    />
                                    : <>
                                        <ActionButton 
                                            buttonClassName='ml-auto'
                                            iconClassName='group-2-hover:fill-green
                                            group-2-focus-visible:fill-green'
                                            iconId='check-icon' 
                                            tooltipContent='Принять'
                                            onClick={handleUnblock}
                                        />

                                        <ActionButton 
                                            buttonClassName='ml-2'
                                            iconClassName='group-2-hover:fill-red
                                            group-2-focus-visible:fill-red'
                                            iconId='cross-icon' 
                                            tooltipContent='Отклонить'
                                            onClick={handleUnblock}
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