import { Button, ContextMenu, RefContextProvider, Tooltip, UserAvatar } from '@components';
import { useThrottle } from '@hooks';
import { conditional, copyToClipboard, twClassNames } from '@utils';
import { FC } from 'react';



const styles = {
    userInfo: `w-full min-w-0 mr-1 px-1 py-0.5 rounded-md flex items-center 
    hover:bg-primary-hover focus-visible:bg-primary-hover focus-within:bg-primary-hover`,
    avatar: 'h-8 w-8',
    username: 'ml-2 text-color-primary font-semibold text-sm truncated',
    tooltipActive: 'bg-positive text-white',
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
        <RefContextProvider>
            <div className={styles.userInfo} tabIndex={0}>
                <UserAvatar
                    className={styles.avatar}
                    avatar='https://i.pravatar.cc/52'
                    status='online'
                />

                <RefContextProvider>
                    <Button
                        className={styles.username}
                        onLeftClick={handleCopy}
                        label={`Скопировать ${username}`}
                    >
                        {username + ' sdfsfasdasddsadasdasd'}
                    </Button>

                    <Tooltip 
                        className={twClassNames({ [styles.tooltipActive]: isThrottling })}
                        preferredAlignment='top'
                        dependencyList={[isThrottling]}
                    >
                        {copyUsernameTooltipText}
                    </Tooltip>
                </RefContextProvider>
            </div>

            <ContextMenu preferredAlignment='top'>
                {({ closeOverlay }) => (
                    <div className='flex flex-col'>
                        <Button onLeftClick={closeOverlay}>change status</Button>

                        <Button 
                            onLeftClick={() => {
                                handleCopy();
                                closeOverlay();
                            }}
                        >
                            <>copy username</>
                        </Button>
                    </div>
                )}
            </ContextMenu>
        </RefContextProvider>
    );
};