import { FC, useMemo } from 'react';
import { IUserPreview } from '@backendTypes';
import { ListHeading, List, ListItem, ActionButton } from '../components';
import { Conditional } from '@components';



interface IBlockedList {
    filterValue: string;
}

const usersMock: IUserPreview[] = [
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

export const BlockedList: FC<IBlockedList> = ({ filterValue }) => {
    const users = useMemo(() => usersMock, []) as IUserPreview[];
    
    const filtredUsers = useMemo(() => {
        return filterValue 
            ? users.filter((user) => user.username.match(filterValue)) 
            : users;
    }, [filterValue, users]);

    const isFiltred = users.length - filtredUsers.length !== 0;

    return (
        <>
            <ListHeading>
                <>Заблокировано — {users.length}</>
                
                <Conditional isRendered={isFiltred}>
                    <> Показано — {filtredUsers.length}</>
                </Conditional>
            </ListHeading>

            <List>
                {
                    filtredUsers.map(({ id, avatar, username, status, extraStatus }) => {
                        const handleUnblock = () => {console.log(`unblock user: ${id}`);};
                    
                        return (
                            <ListItem
                                key={id}
                                avatar={avatar}
                                username={username}
                                status={status}
                                extraStatus={extraStatus}
                                actionButtons={
                                    <ActionButton 
                                        buttonClassName='ml-auto'
                                        iconId='unblock-icon' 
                                        tooltipContent='Разблокировать'
                                        onClick={handleUnblock}
                                    />
                                }
                            />
                        );
                    })
                }
            </List>
        </>
    );
};