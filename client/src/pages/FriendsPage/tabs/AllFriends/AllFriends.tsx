import { Separator } from '@components';
import { FC } from 'react';



export const AllFriends: FC = () => {
    const friends = [''];
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
                            <li key={friend}>
                                {/* <FriendListItem userId=''/> */}
                            </li>
                        );
                    })
                }
            </ul>
        </div>
    );
};