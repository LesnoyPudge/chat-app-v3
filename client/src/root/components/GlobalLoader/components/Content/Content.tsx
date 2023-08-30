import { Link, SpriteImage } from '@components';
import { IMAGES } from '@generated';
import { RICK } from '@vars';
import { FC, useState } from 'react';
import { useTimeout } from 'usehooks-ts';



const styles = {
    wrapper: 'grid place-items-center h-full pointer-events-auto bg-primary-400',
    logo: '',
    problemBlock: 'flex flex-col gap-2 absolute bottom-0 pb-8 px-4 text-center',
    problemText: 'text-sm text-color-secondary',
    links: `flex justify-center gap-x-5 flex-wrap text-color-link 
    [&>a]:inline-flex [&>a]:items-center [&>a]:gap-2`,
    icon: 'inline-block fill-link w-5 h-4',
};

export const Content: FC = () => {
    const [showProblemBlock, setShowProblemBlock] = useState(false);

    useTimeout(() => {
        setShowProblemBlock(true);
    }, 3000);

    return (
        <div className={styles.wrapper}>
            <div className={styles.logo}>
                <>logo</>
            </div>

            <If condition={showProblemBlock}>
                <div className={styles.problemBlock}>
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
                </div>
            </If>
        </div>
    );
};