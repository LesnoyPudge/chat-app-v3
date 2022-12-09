import { Button, ContextMenu, OverlayContextProvider, RefContextProvider, Tooltip, UserAvatar } from '@components';
import { useThrottle } from '@hooks';
import { conditional, copyToClipboard, twClassNames } from '@utils';
import { FC } from 'react';



const styles = {
    userInfoWrapper: 'relative w-full pr-1 group',
    userInfo: `px-1 py-0.5 rounded-md mr-1 flex items-center min-w-0 w-full
    cursor-pointer group-hover:bg-hover group-focus-visible:bg-hover group-focus-within:bg-hover`,
    avatar: 'h-8 w-8',
    username: `text-primary font-semibold text-sm overflow-hidden text-ellipsis 
    whitespace-nowrap rounded absolute top-1/2 -translate-y-1/2 left-0 ml-11`,
    tooltipActive: 'bg-green text-white',
};

export const UserInfo: FC = () => {
    const { throttle, isThrottling } = useThrottle();
    
    const username = 'myName';
    const handleCopy = throttle(() => copyToClipboard(username), 2000);

    const copyUsernameTooltipText = conditional(
        'Cкопировано!', 
        'Нажмите, чтобы скопировать', 
        isThrottling,
    );
    
    return (
        <div className={styles.userInfoWrapper}>
            <OverlayContextProvider>
                {({ closeOverlay, isOverlayExist }) => (
                    <RefContextProvider>
                        <Button 
                            className={styles.userInfo}
                            hasPopup='menu'
                            expanded={isOverlayExist}
                            label='Открыть контекстное меню'
                        >
                            <UserAvatar
                                className={styles.avatar}
                                avatar='https://i.pravatar.cc/52'
                                status='online'
                            />
                        </Button>

                        <ContextMenu 
                            preferredAligment='top'
                            openOnLeftClick
                            openOnRightClick
                        >
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
                )}
            </OverlayContextProvider>
            
            <RefContextProvider>
                <Button
                    className={styles.username}
                    onLeftClick={handleCopy}
                    label='Скопировать имя'
                >
                    {username}
                </Button>

                <Tooltip 
                    className={twClassNames({ [styles.tooltipActive]: isThrottling })}
                    preferredAligment='top'
                    dependencyList={[isThrottling]}
                >
                    {copyUsernameTooltipText}
                </Tooltip>
            </RefContextProvider> 
        </div>
    );
};