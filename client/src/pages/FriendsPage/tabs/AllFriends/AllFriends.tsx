import { Separator, UserAvatar } from '@components';
import { FC } from 'react';
import { IUserPreview } from '@backendTypes';



const friends: IUserPreview[] = [
    {
        id: 'weifoerjf',
        username: 'friend 1',
        avatar: 'https://i.pravatar.cc/50',
        status: 'online',
        extraStatus: 'dnd',
        isDeleted: false,
    },
    {
        id: 'gewfwfewfes',
        username: 'friend 2',
        avatar: 'https://i.pravatar.cc/50',
        status: 'offline',
        extraStatus: 'afk',
        isDeleted: false,
    },
];

export const AllFriends: FC = () => {

    return (
        <div className='flex flex-col items-start py-4 px-[30px]'>
            <div className=''>search</div>

            <div className='uppercase'>
                Всего друзей - {friends.length}
            </div>

            <ul className='flex flex-col'>
                <Separator spacing={4} thikness={1}/>

                {
                    friends.map((friend) => {
                        return (
                            <li key={friend.id}>
                                {/* <FriendListItem userId=''/> */}
                                <div>name: {friend.username}</div>
                                
                                <UserAvatar
                                    size={50}
                                    avatar={friend.avatar} 
                                    username={friend.username} 
                                    status={friend.status} 
                                    extraStatus={friend.extraStatus}
                                />
                            </li>
                        );
                    })
                }
            </ul>
        </div>
    );
};