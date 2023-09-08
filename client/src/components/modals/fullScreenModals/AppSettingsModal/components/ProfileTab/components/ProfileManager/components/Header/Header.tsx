import { FC } from 'react';
import { UserStatus, Image, FileInput } from '@components';
import { FormikFileInput } from '@libs';
import { MBToBytes, getAvatarPath } from '@utils';
import { MIME } from '@vars';
import { useMemoSelector } from '@redux/hooks';
import { AppSelectors } from '@redux/features';



const styles = {
    header: 'flex h-14',
    avatarWrapper: 'w-[94px] relative',
    avatarInner: `absolute w-full aspect-square bottom-0 
    bg-primary-500 rounded-full p-[7px]`,
    avatarButton: 'relative w-full h-full rounded-full peer',
    avatarOverlay: `grid place-items-center absolute inset-0 
    rounded-full opacity-0 bg-black bg-opacity-80 pointer-events-none 
    peer-focus-within:opacity-100 peer-hover:opacity-100 transition-all`,
    avatarOverlayText: 'uppercase font-bold text-2xs text-white text-center',
    avatar: 'w-full h-full rounded-full',
    userStatusWrapper: 'absolute w-8 h-8 p-1.5 bottom-0 right-0 bg-primary-500 rounded-full',
    userStatus: 'w-full h-full',
    username: 'ml-4 text-xl text-color-primary font-medium',
};

export const Header: FC = () => {
    const {
        avatarId,
        extraStatus,
        status,
    } = useMemoSelector((state) => {
        const user = AppSelectors.selectMe(state);

        return {
            avatarId: user.avatarId,
            status: user.status,
            extraStatus: user.extraStatus,
        };
    });

    return (
        <div className={styles.header}>
            <div className={styles.avatarWrapper}>
                <div className={styles.avatarInner}>
                    <FormikFileInput
                        label='Изображение вашего профиля'
                        name='avatar'
                        options={{
                            accept: MIME.IMAGES,
                            amountLimit: 1,
                            sizeLimit: MBToBytes(1),
                        }}
                    >
                        {({ value, fileInputProps }) => (
                            <FileInput
                                className={styles.avatarButton}
                                {...fileInputProps}
                            >
                                <Image
                                    className={styles.avatar}
                                    src={value?.base64 ?? getAvatarPath(avatarId)}
                                    alt='Изображение профиля'
                                />
                            </FileInput>
                        )}
                    </FormikFileInput>

                    <div className={styles.avatarOverlay}>
                        <div className={styles.avatarOverlayText}>
                            <>Изменить <br/> аватар</>
                        </div>
                    </div>

                    <div className={styles.userStatusWrapper}>
                        {(() => {
                            console.log('props is', status, extraStatus);
                            return (
                                <UserStatus
                                    className={styles.userStatus}
                                    status={status}
                                    extraStatus={extraStatus}
                                />
                            );
                        })()}
                    </div>
                </div>
            </div>

            <span className={styles.username}>
                <>лошок111</>
            </span>
        </div>
    );
};