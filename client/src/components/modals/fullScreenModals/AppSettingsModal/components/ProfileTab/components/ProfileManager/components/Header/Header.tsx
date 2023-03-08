import { FC } from 'react';
import { UserStatus, Image } from '@components';
import { FormikFileInput } from '@libs';
import { MBToBytes } from '@utils';



const styles = {
    header: 'flex h-14',
    avatarWrapper: 'w-[94px] relative',
    avatarInner: `absolute w-full aspect-square bottom-0 
    bg-primary-500 rounded-full p-[7px]`,
    avatarButton: 'relative w-full h-full rounded-full group',
    avatarOverlay: `grid place-items-center absolute inset-0 
    rounded-full opacity-0 bg-black bg-opacity-40 pointer-events-none 
    group-focus-within:opacity-100 group-hover:opacity-100 transition-all`,
    avatarOverlayText: 'uppercase font-bold text-2xs text-white text-center',
    avatar: 'w-full h-full rounded-full',
    userStatusWrapper: 'absolute w-7 h-7 p-1.5 -bottom-1 -right-1 bg-primary-500 rounded-full',
    userStatus: 'w-full h-full',
    username: 'ml-4 text-xl text-color-primary font-medium',
};

export const Header: FC = () => {
    const status = 'online';
    const extraStatus = 'default';

    return (
        <div className={styles.header}>
            <div className={styles.avatarWrapper}>
                <div className={styles.avatarInner}>

                    <FormikFileInput 
                        className={styles.avatarButton} 
                        name='avatar' 
                        label='Ваше изображение профиля'
                        accept='image/*'
                        multiple={false}
                        sizeLimit={MBToBytes(1)}
                    >
                        {({ value }) => (
                            <>
                                <Image
                                    className={styles.avatar}
                                    src='https://i.pravatar.cc/52'
                                    file={value[0]}
                                    alt='Изображение профиля'
                                />

                                <div className={styles.avatarOverlay}>
                                    <div className={styles.avatarOverlayText}>
                                        <>Изменить <br/> аватар</>
                                    </div>
                                </div>

                                <div className={styles.userStatusWrapper}>
                                    <UserStatus
                                        className={styles.userStatus}
                                        status={status}
                                        extraStatus={extraStatus}
                                    />
                                </div>
                            </>
                        )}
                    </FormikFileInput>
                </div>
            </div>

            <span className={styles.username}>
                <>лошок111</>
            </span>
        </div>
    );
};