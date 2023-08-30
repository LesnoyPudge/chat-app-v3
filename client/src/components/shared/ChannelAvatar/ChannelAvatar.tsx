import { PropsWithClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';
import { Image } from '@components';



interface ChannelAvatar extends PropsWithClassName {
    avatar?: string | null;
    name?: string;
}

const styles = {
    wrapper: '@container h-10 w-10 shrink-0 rounded-full overflow-hidden',
    image: 'h-full w-full',
    nameWrapper: 'h-full flex justify-center items-center',
    name: 'px-1.5 truncate font-medium text-base @[40px]:text-lg',
};

export const ChannelAvatar: FC<ChannelAvatar> = ({
    className = '',
    avatar,
    name = '',
}) => {
    const formattedName = name.split(' ').map(word => word.charAt(0)).join('');

    return (
        <div className={twClassNames(styles.wrapper, className)}>
            <If condition={!!avatar}>
                <Image
                    className={styles.image}
                    src={avatar}
                    alt={`Изображение канала ${name}`}
                />
            </If>

            <If condition={!avatar}>
                <div className={styles.nameWrapper}>
                    <div className={styles.name}>
                        {formattedName}
                    </div>
                </div>
            </If>
        </div>
    );
};