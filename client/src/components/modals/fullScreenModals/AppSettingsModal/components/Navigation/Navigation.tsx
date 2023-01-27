import { AppSettingsModalTabs, ArrowFocusContextProvider, ArrowFocusItem, Button, Icon, Link, Separator, TabContext, TabList } from '@components';
import { FC, useContext } from 'react';
import { NavigationHeading, NavigationItem } from '../../../components';



const styles = {
    button: 'group',
    logoutButton: 'hover:fill-icon-100 flex justify-between items-center',
    logoutIcon: 'h-4 w-4 fill-icon-200',
    socialWrapper: 'flex gap-1.5 mt-2 px-2.5',
    socialIconWrapper: 'p-1 fill-icon-200 hover:fill-icon-100 focus-visible:fill-icon-100',
    socialIcon: 'h-5 w-5',
};

export const Navigation: FC = () => {
    const { changeTab, tabs, isActive } = useContext(TabContext) as TabContext<AppSettingsModalTabs>;

    return (
        <div>
            <TabList label='Настройки приложения' orientation='vertical'>
                <ArrowFocusContextProvider list={tabs} direction='vertical'>
                    <NavigationHeading>
                        <>Настройки пользователя</>
                    </NavigationHeading>

                    <ArrowFocusItem id={tabs.profileTab.identifier}>
                        {({ tabIndex }) => (
                            <Button
                                className={styles.button}
                                isActive={isActive.profileTab}
                                label='Моя учётная запись'
                                role='tab'
                                controls={tabs.profileTab.identifier}
                                tabIndex={tabIndex}
                                onLeftClick={changeTab.profileTab}
                            >
                                <NavigationItem isActive={isActive.profileTab}>
                                    <>Моя учётная запись</>
                                </NavigationItem>
                            </Button>
                        )}
                    </ArrowFocusItem>

                    <Separator spacing={16}/>

                    <NavigationHeading>
                        <>Настройки приложения</>
                    </NavigationHeading>

                    <ArrowFocusItem id={tabs.appearanceTab.identifier}>
                        {({ tabIndex }) => (
                            <Button
                                className={styles.button}
                                isActive={isActive.appearanceTab}
                                label='Внешний вид'
                                role='tab'
                                controls={tabs.appearanceTab.identifier}
                                tabIndex={tabIndex}
                                onLeftClick={changeTab.appearanceTab}
                            >
                                <NavigationItem isActive={isActive.appearanceTab}>
                                    <>Внешний вид</>
                                </NavigationItem>
                            </Button>
                        )}
                    </ArrowFocusItem>
                </ArrowFocusContextProvider>
            </TabList>

            <Separator spacing={16}/>
                        
            <Button
                className={styles.button}
                label='Выйти за аккаунта'
                onLeftClick={() => console.log('click on logout button')}
            >
                <NavigationItem className={styles.logoutButton}>
                    <span>Выйти</span>

                    <Icon 
                        className={styles.logoutIcon} 
                        iconId='doorway-icon'
                    />
                </NavigationItem>
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
        </div>
    );
};