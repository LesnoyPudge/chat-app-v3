import { Button, Image } from '@components';
import { IMAGES } from '@generated';
import { Heading } from '@libs';
import { FC } from 'react';



type ErrorPage = {
    onReload: () => void;
}

const styles = {
    page: `page flex flex-col items-center justify-center text-center
    overflow-y-auto bg-primary-300 text-color-base`,
    bg: 'image-bg-fullscreen',
    image: 'w-[min(254px,100%)] aspect-[254/154]',
    heading: 'text-xl text-color-primary mt-5 font-semibold',
    text: 'text-color-muted mt-3',
    button: 'font-semibold mt-6',
};

export const ErrorPage: FC<ErrorPage> = ({ onReload }) => {
    return (
        <div className={styles.page}>
            <Image
                className={styles.bg}
                src={IMAGES.COMMON.ERROR_BOUNDARY_BG.PATH}
            />

            <Image
                className={styles.image}
                src={IMAGES.COMMON.ERROR_BOUNDARY_IMAGE.PATH}
            />

            <Heading className={styles.heading}>
                <>Как-то неловко получается</>
            </Heading>

            <div className={styles.text}>
                <p>В приложении возник неожиданный сбой....</p>

                <p>Мы отследили ошибку и вскоре ей займёмся.</p>
            </div>

            <Button
                className={styles.button}
                size='big'
                stylingPreset='brand'
                onLeftClick={onReload}
            >
                <>Перезагрузить</>
            </Button>
        </div>
    );
};