import { twClassNames } from '@utils';
import { FC, ReactNode, useContext } from 'react';
import { Button, Image, OverlayContext } from '@components';
import { Heading } from '@libs';
import fileTextImage from '@assets/file-text-image.svg';
import fileImageImage from '@assets/file-image-image.svg';
import fileCodeImage from '@assets/file-code-image.svg';
import { PropsWithClassName } from '@types';



interface Content extends PropsWithClassName {
    header: ReactNode;
    content: ReactNode;
}

const styles = {
    container: 'rounded-xl p-2 w-[min(310px,100vw)]',
    inner: 'flex flex-col rounded-md border-2 border-white border-dashed',
    imageWrapper: 'self-center relative h-9 w-24',
    image: 'absolute w-[74px] bottom-0 -translate-x-1/2 shadow-elevation-medium',
    firstImage: 'left-0 -rotate-[30deg]',
    secondImage: 'z-10 left-1/2 -translate-y-3',
    thirdImage: 'left-full rotate-[30deg]',
    contentWrapper: 'px-2 pb-6 pt-6 text-center text-white',
    heading: 'font-bold text-xl mb-1.5',
    text: 'text-xs',
};

export const Content: FC<Content> = ({
    className = '',
    content,
    header,
}) => {
    const { closeOverlay } = useContext(OverlayContext) as OverlayContext;

    return (
        <Button 
            className={twClassNames(styles.container, className)}
            label='Закрыть'
            onLeftClick={closeOverlay}
        >
            <div className={styles.inner}>
                <div className={styles.imageWrapper}>
                    <Image 
                        className={twClassNames(styles.image, styles.firstImage)}
                        src={fileTextImage}
                    />

                    <Image 
                        className={twClassNames(styles.image, styles.secondImage)}
                        src={fileImageImage}
                    />

                    <Image 
                        className={twClassNames(styles.image, styles.thirdImage)}
                        src={fileCodeImage}
                    />
                </div>

                <div className={styles.contentWrapper}>
                    <Heading className={styles.heading}>
                        {header}
                    </Heading>

                    <p className={styles.text}>
                        {content}
                    </p>
                </div>
            </div>
        </Button>
    );
};