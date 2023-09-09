import { PropsWithClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';
import { Image } from '@components';



interface ChannelAvatar extends PropsWithClassName {
    avatar?: string | null;
    name?: string;
}

const styles = {
    wrapper: '@container flex justify-center items-center h-10 w-10 shrink-0 rounded-full overflow-hidden pointer-events-none',
    image: 'h-full w-full',
    name: 'select-none px-1.5 truncate font-medium text-[35cqw] leading-none uppercase',
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
                <div className={styles.name}>
                    {formattedName}
                </div>
            </If>
        </div>
    );
};