import { Image, Space } from '@components';
import { IMAGES } from '@generated';
import { Heading } from '@libs';
import { FC } from 'react';



const styles = {
    wrapper: 'flex justify-center h-full',
    inner: 'flex flex-col justify-center items-center gap-10 max-w-[440px]',
    image: 'w-[min(272px,100%)]',
    text: 'text-center text-color-secondary',
    heading: 'uppercase font-semibold text-heading-m mb-2',
};

export const NoRoomsSubPage: FC = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.inner}>
                <Image
                    className={styles.image}
                    src={IMAGES.COMMON.ROOMS_NOT_FOUND.PATH}
                />

                <div className={styles.text}>
                    <Heading className={styles.heading}>
                        <>Нет текстовых комнат</>
                    </Heading>

                    <p>
                        <>Вы оказались в странном месте.</>

                        <Space/>

                        <>У вас нет доступа к текстовым комнатам, или на этом канале их нет.</>
                    </p>
                </div>
            </div>
        </div>
    );
};