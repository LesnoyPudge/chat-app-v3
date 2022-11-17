import { Button, Icon, Link, Separator } from '@components';
import { twClassNames } from '@utils';
import { FC } from 'react';



const styles = {
    wrapper: 'grow shrink-0 basis-[218px] bg-primary-300',
    inner: `flex h-full justify-end overflow-x-hidden 
    overflow-y-scroll scrollbar-primary `,
    nav: 'w-60 py-[60px] pl-5 pr-1.5 h-fit',
    group: 'grid gap-0.5',
    subList: 'grid gap-0.5',
    heading: `py-1.5 px-2.5 text-xs text-room font-medium uppercase 
    cursor-default whitespace-nowrap text-ellipsis overflow-hidden`,
    item: `w-full py-1.5 px-2.5 text-secondary font-medium 
    rounded-md hover:bg-hover hover:text-primary text-start`,
    logoutButton: 'hover:fill-icon-100 flex justify-between items-center',
    logoutIcon: 'h-4 w-4 fill-icon-200',
    socialWrapper: 'flex gap-3 mt-2',
    socialIcon: 'h-5 w-5 fill-icon-200 hover:fill-icon-100',
};

export const NavigationSide: FC = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.inner}>
                <nav className={styles.nav}>
                    <ul className='grid'>
                        <li className={styles.group}>
                            <span className={twClassNames(styles.heading, 'pt-0')}>
                                <>Настройки пользователя</>
                            </span>

                            <ul className={styles.subList}>
                                <li>
                                    <Button 
                                        className={styles.item}
                                        isntStyled
                                    >
                                        <>Моя учётная запись</>
                                    </Button>
                                </li>
                            </ul>

                            <Separator spacing={8}/>
                        </li>

                        <li className={styles.group}>
                            <span className={styles.heading}>
                                <>Настройки приложения</>
                            </span>

                            <ul className={styles.subList}>
                                <li>
                                    <Button 
                                        className={styles.item}
                                        isntStyled
                                    >
                                        <>Внешний вид</>
                                    </Button>
                                </li>
                            </ul>

                            <Separator spacing={8}/>
                        </li>

                        <li className={styles.group}>
                            <Button 
                                className={twClassNames(styles.item, styles.logoutButton)}
                                isntStyled
                            >
                                <span>Выйти</span>

                                <Icon 
                                    className={styles.logoutIcon} 
                                    iconId='doorway-icon'
                                />
                            </Button>

                            <Separator spacing={8}/>
                        </li>
                    </ul>

                    <div className={styles.socialWrapper}>
                        <Link href='https://twitter.com/discord'>
                            <Icon 
                                className={styles.socialIcon}
                                iconId='twitter-icon'
                            />
                        </Link>

                        <Link href='https://www.facebook.com/discord'>
                            <Icon
                                className={styles.socialIcon}
                                iconId='facebook-icon'
                            />
                        </Link>

                        <Link href='https://www.instagram.com/discord/'>
                            <Icon 
                                className={styles.socialIcon}
                                iconId='instagram-icon'
                            />
                        </Link>
                    </div>
                </nav>
            </div>
        </div>
    );
};