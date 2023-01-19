import { AppSettingsModalTabs, Button, Icon, Link, Separator, TabContext, TabList } from '@components';
import { twClassNames } from '@utils';
import { FC, useContext } from 'react';



const styles = {
    heading: 'mb-1.5 px-2.5 text-xs text-room font-bold uppercase truncated',
    item: {
        base: `w-full py-1.5 px-2.5 text-secondary font-medium text-start
        rounded-md hover:bg-hover hover:text-primary focus-visible:bg-hover 
        focus-visible:text-primary`,
        active: 'bg-hover text-primary',
    },
    logoutButton: 'hover:fill-icon-100 flex justify-between items-center',
    logoutIcon: 'h-4 w-4 fill-icon-200',
    socialWrapper: 'flex gap-1.5 mt-2 px-2.5',
    socialIconWrapper: 'p-1 fill-icon-200 hover:fill-icon-100 focus-visible:fill-icon-100',
    socialIcon: 'h-5 w-5',
};

export const Navigation: FC = () => {
    const { changeTab } = useContext(TabContext) as TabContext<AppSettingsModalTabs>;

    return (
        <TabList label='Настройки приложения'>
            <div className={styles.heading}>
                <>Настройки пользователя</>
            </div>

            <Button 
                className={styles.item.base}
                onLeftClick={changeTab.profileTab}
            >
                <>Моя учётная запись</>
            </Button>

            <Separator spacing={16}/>

            <div className={styles.heading}>
                <>Настройки приложения</>
            </div>

            <Button 
                className={styles.item.base}
                onLeftClick={changeTab.appearanceTab}
            >
                <>Внешний вид</>
            </Button>

            <Separator spacing={16}/>

            <Button 
                className={twClassNames(styles.item.base, styles.logoutButton)}
                onLeftClick={() => console.log('click on logout button')}
                label='Выйти из аккаунта'
            >
                <span>Выйти</span>

                <Icon 
                    className={styles.logoutIcon} 
                    iconId='doorway-icon'
                />
            </Button>

            <Separator spacing={16}/>

            <div className={styles.socialWrapper}>
                <Link 
                    className={styles.socialIconWrapper}
                    href='https://twitter.com/discord'
                >
                    <Icon 
                        className={styles.socialIcon}
                        iconId='twitter-icon'
                    />
                </Link>

                <Link
                    className={styles.socialIconWrapper}
                    href='https://www.facebook.com/discord'
                >
                    <Icon
                        className={styles.socialIcon}
                        iconId='facebook-icon'
                    />
                </Link>

                <Link
                    className={styles.socialIconWrapper}
                    href='https://www.instagram.com/discord/'
                >
                    <Icon 
                        className={styles.socialIcon}
                        iconId='instagram-icon'
                    />
                </Link>
            </div>
        </TabList>
    );
};