import { AppSettingsModal, Button, ContextMenu, OverlayContextProvider, RefContextProvider, Tooltip, UserAvatar } from '@components';
import { useThrottle, useToggle } from '@hooks';
import { conditional, copyToClipboard, twClassNames } from '@utils';
import { FC } from 'react';
import { ToolBarButton } from './components';



const styles = {
    wrapper: 'flex shrink-0 mt-auto items-center h-[52px] py-0 px-2 bg-primary-400',
    userInfo: `px-1 py-0.5 rounded-md mr-1 flex items-center min-w-0 w-full
    cursor-pointer hover:bg-hover focus-visible:bg-hover focus-within:bg-hover`,
    avatar: 'h-8 w-8',
    username: `text-primary font-semibold text-sm ml-2 overflow-hidden text-ellipsis 
    whitespace-nowrap rounded`,
};

export const UserToolBar: FC = () => {
    const { throttle, isThrottling } = useThrottle();
    const [isVoiceMuted, toggleVoice] = useToggle();
    const [isSoundMuted, toggleSound] = useToggle();

    const username = 'myName';
    const handleCopy = throttle(() => copyToClipboard(username), 2000);

    const copyUsernameTooltipText = conditional(
        'Cкопировано!', 
        'Нажмите, чтобы скопировать', 
        isThrottling,
    );

    return (
        <div className={styles.wrapper}>
            <OverlayContextProvider>
                {({ openOverlay, closeOverlay }) => (
                    <>
                        <RefContextProvider>
                            <div 
                                className={styles.userInfo} 
                                tabIndex={0}
                                onContextMenu={openOverlay}
                            >
                                <UserAvatar
                                    className={styles.avatar}
                                    avatar='https://i.pravatar.cc/52'
                                    status='online'
                                />

                                <RefContextProvider>
                                    <Button
                                        className={styles.username}
                                        isntStyled
                                        onClick={handleCopy}
                                    >
                                        {username}
                                    </Button>

                                    <Tooltip 
                                        className={twClassNames({ 'bg-green text-white': isThrottling })}
                                        preferredAligment='top'
                                        dependencyList={[isThrottling]}
                                    >
                                        {copyUsernameTooltipText}
                                    </Tooltip>
                                </RefContextProvider>
                            </div>

                            <ContextMenu preferredAligment='top'>
                                <div className='flex flex-col'>
                                    <button onClick={closeOverlay}>change status</button>
                                    <button 
                                        onClick={() => {
                                            handleCopy();
                                            closeOverlay();
                                        }}
                                    >
                                        <>copy username</>
                                    </button>
                                </div>
                            </ContextMenu>
                        </RefContextProvider>
                    </>
                )}
            </OverlayContextProvider>
            
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

            <OverlayContextProvider>
                {({ openOverlay }) => (
                    <>
                        <ToolBarButton
                            defaultIconId='settings-gear'
                            defaultTooltipContent='Настройки'
                            onClick={openOverlay}
                        />

                        <AppSettingsModal/>
                    </>
                )}
            </OverlayContextProvider>
        </div>
    );
};