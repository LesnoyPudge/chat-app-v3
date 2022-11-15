import { Button, ContextMenu, RefContextProvider, Tooltip, UserAvatar } from '@components';
import { useConditional, useThrottle, useToggle } from '@hooks';
import { copyToClipboard, twClassNames } from '@utils';
import { FC } from 'react';
import { ToolBarButton } from './components';



export const UserToolBar: FC = () => {
    const { throttle, isThrottling } = useThrottle();
    const [isVoiceMuted, toggleVoice] = useToggle();
    const [isSoundMuted, toggleSound] = useToggle();
    const [copyUsernameTooltipText] = useConditional(
        'Cкопировано!', 
        'Нажмите, чтобы скопировать', 
        isThrottling,
    );

    const username = 'myName';
    const handleCopy = throttle(() => copyToClipboard(username), 2000);

    return (
        <div className='flex shrink-0 mt-auto items-center h-[52px] py-0 px-2 bg-primary-400'>
            <RefContextProvider>
                <div 
                    className='px-1 py-0.5 rounded-md mr-1 flex items-center min-w-0 w-full
                    cursor-pointer hover:bg-hover focus-visible:bg-hover focus-within:bg-hover' 
                    tabIndex={0}
                >
                    <UserAvatar
                        className='h-8 w-8'
                        avatar='https://i.pravatar.cc/52'
                        status='online'
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

                        <Tooltip 
                            className={twClassNames({ 'bg-green text-white': isThrottling })}
                            position='top'
                        >
                            {copyUsernameTooltipText}
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
                isActive={isVoiceMuted}
                defaultIconId='microphone'
                activeIconId='microphone-muted'
                defaultTooltipContent='Откл. микрофон'
                activeTooltipContent= 'Вкл. микрофон'
                onClick={toggleVoice}
            />

            <ToolBarButton
                isActive={isSoundMuted}
                defaultIconId='headphone'
                activeIconId='headphone-muted'
                defaultTooltipContent='Откл. звук'
                activeTooltipContent= 'Вкл. звук'
                onClick={toggleSound}
            />

            <ToolBarButton
                defaultIconId='settings-gear'
                defaultTooltipContent='Настройки пользователя'
                onClick={() => console.log('open modal settings')}
            />
        </div>
    );
};