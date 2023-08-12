import { Button, OverlayContextProvider, Popup, Ref, UserAvatar } from '@components';
import { AppSelectors } from '@redux/features';
import { useMemoSelector } from '@redux/hooks';
import { FC } from 'react';
import { Menu } from './components';



const styles = {
    userInfo: `w-full min-w-0 mr-1 px-1 py-0.5 rounded-md flex items-center 
    hover:bg-primary-hover focus-visible:bg-primary-hover focus-within:bg-primary-hover`,
    avatar: 'h-8 w-8',
    username: 'ml-2 text-color-primary font-semibold text-sm truncated',
};

export const UserInfo: FC = () => {
    const username = useMemoSelector((s) => AppSelectors.selectMe(s).username);
    const avatarId = useMemoSelector((s) => AppSelectors.selectMe(s).avatarId);
    const extraStatus = useMemoSelector((s) => AppSelectors.selectMe(s).extraStatus);

    return (
        <Ref<HTMLButtonElement>>
            {(ref) => (
                <OverlayContextProvider>
                    {({ toggleOverlay, isOverlayExist }) => (
                        <>
                            <Button
                                className={styles.userInfo}
                                innerRef={ref}
                                hasPopup='menu'
                                label='Меню действий'
                                isActive={isOverlayExist}
                                onLeftClick={toggleOverlay}
                            >
                                <UserAvatar
                                    className={styles.avatar}
                                    avatarId={avatarId}
                                    status='online'
                                    extraStatus={extraStatus}
                                    username=''
                                />

                                <div className={styles.username}>
                                    {username}
                                </div>
                            </Button>

                            <Popup
                                preferredAlignment='top'
                                leaderElementOrRectRef={ref}
                                label='Меню действий'
                                role='menu'
                                centered
                                spacing={10}
                            >
                                <Menu/>
                            </Popup>
                        </>
                    )}
                </OverlayContextProvider>
            )}
        </Ref>
    );
};