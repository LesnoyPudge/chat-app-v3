import { useFileDrop } from '@hooks';
import { animated } from '@react-spring/web';
import { getHTML, getTransitionOptions, twClassNames } from '@utils';
import { FC, useRef } from 'react';
import { Conditional, AnimatedTransition, OverlayPortal, Image } from '@components';
import { Heading, HeadingLevel } from '@libs';



const styles = {
    wrapper: 'overlay-item-wrapper flex items-center justify-center',
    backdrop: 'fixed inset-0 bg-black opacity-70 -z-10 scale-[999]',
    container: 'bg-brand rounded-xl p-2',
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

export const FileDrop: FC = () => {
    const rootRef = useRef(getHTML().root);
    const { isDragOver } = useFileDrop({ multiple: true }, rootRef);

    const heading = 'Загрузить на #general';

    return (
        <AnimatedTransition 
            isExist={isDragOver}
            transitionOptions={getTransitionOptions.defaultModal()}
        >
            {({ isAnimatedExist, style }) => (
                <Conditional isRendered={isAnimatedExist}>
                    <OverlayPortal>
                        <animated.div style={style} className={styles.wrapper}>
                            <div className={styles.backdrop}></div>

                            <HeadingLevel>
                                <div className={styles.container}>
                                    <div className={styles.inner}>
                                        <div className={styles.imageWrapper}>
                                            <Image 
                                                className={twClassNames(styles.image, styles.firstImage)}
                                                src='\src\assets\filedrop-image-1.svg'
                                            />

                                            <Image 
                                                className={twClassNames(styles.image, styles.secondImage)}
                                                src='\src\assets\filedrop-image-2.svg'
                                            />

                                            <Image 
                                                className={twClassNames(styles.image, styles.thirdImage)}
                                                src='\src\assets\filedrop-image-3.svg'
                                            />
                                        </div>

                                        <div className={styles.contentWrapper}>
                                            <Heading className={styles.heading}>
                                                <>{heading}</>
                                            </Heading>

                                            <p className={styles.text}>
                                                <>Вы можете добавить комментарий к загружаемому файлу.</>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </HeadingLevel>
                        </animated.div>
                    </OverlayPortal>
                </Conditional>
            )}
        </AnimatedTransition>
    );
};