import { Button, ContextMenu, RefContextProvider, Tooltip, UserAvatar } from '@components';
import { useThrottle, useToggle } from '@hooks';
import { copyToClipboard } from '@utils';
import { FC } from 'react';
import { ToolBarButton } from '..';



export const UserToolBar: FC = () => {
    const { throttle, isThrottling } = useThrottle();
    const username = 'myName';
    const handleCopy = throttle(() => copyToClipboard(username), 2000);
    const micValue = useToggle();
    const headValue = useToggle();

    return (
        <div className='bg-primary-400 h-[52px] py-0 px-2 flex mt-auto items-center'>
            <RefContextProvider>
                <div 
                    className='px-1 py-0.5 rounded-md mr-1 flex items-center min-w-0 w-full
                    cursor-pointer hover:bg-hover focus-visible:bg-hover focus-within:bg-hover' 
                    tabIndex={0}
                >
                    <UserAvatar
                        avatar='https://i.pravatar.cc/52'
                        status='online'
                        size={32}
                    />

                    <RefContextProvider>
                        <Button
                            className='text-primary font-semibold text-sm ml-2 
                            overflow-hidden text-ellipsis whitespace-nowrap rounded'
                            isntStyled
                            onClick={handleCopy}
                        >
                            {username}
                        </Button>

                        <Tooltip position='top' className={isThrottling ? 'bg-green text-white' : ''}>
                            { isThrottling ? 'Cкопировано!' : 'Нажмите, чтобы скопировать'}
                        </Tooltip>
                    </RefContextProvider>
                </div>

                <ContextMenu handleLeftClick handleMiddleClick>
                    {({ unmount }) => (
                        <div className='flex flex-col'>
                            <button onClick={unmount}>change status</button>
                            <button 
                                onClick={() => {
                                    handleCopy();
                                    unmount();
                                }}
                            >
                                <>copy username</>
                            </button>
                        </div>
                    )}
                </ContextMenu>
            </RefContextProvider>
            
            <ToolBarButton
                isActive={micValue.state}
                defaultIconId='microphone'
                activeIconId='microphone-muted'
                defaultTooltipContent='Откл. микрофон'
                activeTooltipContent= 'Вкл. микрофон'
                onClick={micValue.toggle}
            />

            <ToolBarButton
                isActive={headValue.state}
                defaultIconId='headphone'
                activeIconId='headphone-muted'
                defaultTooltipContent='Откл. звук'
                activeTooltipContent= 'Вкл. звук'
                onClick={headValue.toggle}
            />

            <ToolBarButton
                defaultIconId='settings-gear'
                defaultTooltipContent='Настройки пользователя'
                onClick={() => console.log('open modal settings')}
            />
        </div>
    );
};