import { TopBar, UserStatus, RefContextProvider, Button, Icon, Tooltip, Conditional, UserAvatar } from '@components';
import { twClassNames } from '@utils';
import { FC, useState } from 'react';



const friend = {
    id: '1',
    avatar: 'qwe',
    username: 'friend 1',
    status: 'online',
    extraStatus: 'default',
};

export const Header: FC = () => {
    const [inCall, setInCall] = useState(false);

    const handleClick = () => setInCall(prev => !prev);
    
    return (
        <div className={twClassNames('flex flex-col w-full', { 'bg-primary-500 shadow-elevation-low': inCall })}>
            <TopBar className={twClassNames('px-4', { 'shadow-none': inCall })}>
                <span 
                    className='font-bold text-ellipsis
                        overflow-hidden whitespace-nowrap'
                >
                    {friend.username}
                </span>

                <UserStatus 
                    className='w-2.5 h-2.5 mx-2.5'
                    status='online'
                />

                <RefContextProvider>
                    <Button 
                        className='ml-auto fill-icon-200 hover:fill-icon-100'
                        onLeftClick={handleClick}
                    >
                        <Icon
                            className='w-6 h-6'
                            iconId='call'
                        />
                    </Button>

                    <Tooltip preferredAligment='bottom'>
                        <>Начать голосовой звонок</>
                    </Tooltip>
                </RefContextProvider>
            </TopBar>

            <Conditional isRendered={inCall}>
                <div 
                    className='flex flex-col justify-between items-center
                        gap-2 pb-4 px-4
                        min-h-[min(150px,50vh)] max-h-[max(150px,50vh)]'
                >
                    <UserAvatar
                        className='h-20 w-20'
                        avatar='https://i.pravatar.cc/200' 
                        username='me' 
                    />

                    <div className='flex gap-4 h-[56px] shrink-0'>
                        <Button 
                            className='rounded-full'
                        >
                            wow
                        </Button>

                        <Button 
                            className='rounded-full'
                        >
                            amazing
                        </Button>

                        <Button 
                            className='rounded-full'
                        >
                            cool
                        </Button>
                    </div>
                </div>
            </Conditional>
        </div>
    );
};