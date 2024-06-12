import { FC } from 'react';
import { Tooltip, UserStatus, Image, Ref } from '@components';
import { getAvatarPath, twClassNames } from '@utils';
import { PropsWithClassName } from '@types';
import { STATUS_LABEL } from '@vars';
import { Entities } from '@shared';



interface UserAvatar extends PropsWithClassName {
    avatarId: string;
    hideStatus?: boolean;
    username?: string;
    status?: Entities.User.Status;
    extraStatus?: Entities.User.ExtraStatus;
}

const styles = {
    wrapper: 'relative flex shrink-0 aspect-square overflow-hidden',
    avatar: 'object-cover w-full h-full rounded-full',
    status: 'absolute bottom-0 right-0 w-1/3 h-1/3',
    svg: 'w-full h-full',
};

export const UserAvatar: FC<UserAvatar> = ({
    className = '',
    hideStatus = false,
    avatarId,
    username,
    status = 'offline',
    extraStatus = 'default',
}) => {
    const statusTitle = (
        status === 'offline'
            ? STATUS_LABEL[status]
            : STATUS_LABEL[extraStatus]
    );
    const alt = `${username}\`s avatar`;

    return (
        <div className={twClassNames(styles.wrapper, className)}>
            <If condition={hideStatus}>
                <Image
                    className={styles.avatar}
                    src={getAvatarPath(avatarId)}
                    alt={alt}
                />
            </If>

            <If condition={!hideStatus}>
                <Ref<HTMLDivElement>>
                    {(ref) => (
                        <>
                            <svg className={styles.svg}>
                                <foreignObject
                                    x={0} y={0}
                                    height={'100%'}
                                    width={'100%'}
                                    mask='url(#avatar-with-status-mask)'
                                >
                                    <Image
                                        className={styles.avatar}
                                        src={getAvatarPath(avatarId)}
                                        alt={alt}
                                    />
                                </foreignObject>
                            </svg>

                            <div
                                className={styles.status}
                                role='img'
                                aria-label={statusTitle}
                                ref={ref}
                            >
                                <UserStatus
                                    status={status}
                                    extraStatus={extraStatus}
                                />
                            </div>

                            <Tooltip
                                preferredAlignment='top'
                                leaderElementRef={ref}
                            >
                                {statusTitle}
                            </Tooltip>
                        </>
                    )}
                </Ref>
            </If>
        </div>
    );
};