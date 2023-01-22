import { useFileLoader } from '@hooks';
import { FC, useEffect } from 'react';
import { Button, UserStatus, Image } from '@components';



const styles = {
    header: 'flex h-14',
    avatarWrapper: 'w-[94px] relative',
    avatarInner: `flex absolute w-full aspect-square bottom-0 
    bg-primary-500 rounded-full p-[7px]`,
    avatarButton: 'relative w-full h-full rounded-full group',
    avatarOverlay: `grid place-items-center absolute w-full h-full rounded-full isolate
    before:opacity-0 before:bg-primary-300 before:group-hover:opacity-80 
    before:group-focus-visible:opacity-80 before:transition-all before:absolute 
    before:top-0 before:left-0 before:w-full before:h-full before:rounded-full before:-z-10`,
    avatarOverlayText: `text-xxs font-bold uppercase opacity-0 group-hover:opacity-100 
    group-focus-visible:opacity-100 transition-all`,
    avatar: 'w-full h-full rounded-full',
    userStatusWrapper: 'absolute w-7 h-7 p-1.5 -bottom-1 -right-1 bg-primary-500 rounded-full',
    userStatus: 'w-full h-full',
    username: 'ml-4 text-xl text-primary font-medium',
};

export const Header: FC = () => {
    const { openFileLoader, files } = useFileLoader();

    useEffect(() => {
        console.log(files);
    }, [files]);

    const status = 'online';
    const extraStatus = 'default';

    return (
        <div className={styles.header}>
            <div className={styles.avatarWrapper}>
                <div className={styles.avatarInner}>
                    <Button
                        className={styles.avatarButton}
                        onLeftClick={openFileLoader}
                    >
                        <div className={styles.avatarOverlay}>
                            <span className={styles.avatarOverlayText}>
                                <>Изменить аватар</>
                            </span>
                        </div>

                        <Image
                            className={styles.avatar}
                            src='https://i.pravatar.cc/52'
                            alt='my avatar'
                        />

                        <div className={styles.userStatusWrapper}>
                            <UserStatus
                                className={styles.userStatus}
                                status={status}
                                extraStatus={extraStatus}
                            />
                        </div>
                    </Button>
                </div>
            </div>

            <span className={styles.username}>
                <>лошок111</>
            </span>
        </div>
    );
};