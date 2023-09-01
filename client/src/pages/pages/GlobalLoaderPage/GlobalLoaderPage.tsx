import { AnimatedTransition, Link, SpriteImage } from '@components';
import { IMAGES } from '@generated';
import { RICK } from '@vars';
import { FC, useState } from 'react';
import { useTimeout } from '@hooks';
import animatedLogo from '@assets/video/discord-animated-logo.webm';
import { getTransitionOptions } from '@utils';
import { animated } from '@react-spring/web';



const styles = {
    wrapper: 'page grid place-items-center pointer-events-auto bg-primary-400',
    logo: 'h-[200px] w-[200px]',
    problemBlock: `flex flex-col gap-2 absolute bottom-0 pb-8 px-4 text-center
    bg-primary-400`,
    problemText: 'text-sm text-color-secondary',
    links: `flex justify-center gap-x-5 flex-wrap text-color-link 
    [&>a]:inline-flex [&>a]:items-center [&>a]:gap-2`,
    icon: 'inline-block fill-link w-5 h-4',
};

const transitionOptions = getTransitionOptions.inOut();

export const GlobalLoaderPage: FC = () => {
    const [showProblemBlock, setShowProblemBlock] = useState(false);

    useTimeout(() => {
        setShowProblemBlock(true);
    }, 3000);

    return (
        <div className={styles.wrapper}>
            <video
                className={styles.logo}
                autoPlay
                loop
                disablePictureInPicture
                disableRemotePlayback
                playsInline
                muted
                poster={IMAGES.COMMON.ANIMATED_DISCORD_LOGO_PLACEHOLDER.PATH}
            >
                <source src={animatedLogo} type='video/webm'/>
            </video>

            <AnimatedTransition
                isExist={showProblemBlock}
                transitionOptions={transitionOptions}
            >
                {({ isAnimatedExist, style }) => (
                    <If condition={isAnimatedExist}>
                        <animated.div
                            className={styles.problemBlock}
                            style={{
                                opacity: style.value,
                                translateY: style.value.to({
                                    range: [0, 1],
                                    output: [100, 0],
                                }).to((v) => `${v}%`),
                            }}
                        >
                            <p className={styles.problemText}>
                                <>Проблемы с подключением? Сообщите нам!</>
                            </p>

                            <div className={styles.links}>
                                <Link href={RICK}>
                                    <SpriteImage
                                        className={styles.icon}
                                        name={IMAGES.SPRITE.TWITTER_ICON.NAME}
                                    />

                                    <>Напишите нам в Твиттере</>
                                </Link>

                                <Link href={RICK}>
                                    <>Состояние сервера</>
                                </Link>
                            </div>
                        </animated.div>
                    </If>
                )}
            </AnimatedTransition>
        </div>
    );
};