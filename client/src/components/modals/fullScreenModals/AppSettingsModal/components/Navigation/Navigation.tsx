import { AppSettingsModalTabs, Button,SpriteImage, Link, Separator, TabContext, TabList , MoveFocusInside } from '@components';
import { useKeyboardNavigation } from '@hooks';
import { objectKeysToIdArray } from '@utils';
import { FC, useContext, useRef } from 'react';

import { NavigationHeading, NavigationItem } from '../../../components';



const styles = {
    button: 'group w-full',
    logoutButton: 'hover:fill-icon-100 flex justify-between items-center',
    logoutIcon: 'h-4 w-4 fill-icon-200',
    socialWrapper: 'flex gap-1.5 mt-2 px-2.5',
    socialIconWrapper: 'p-1 fill-icon-200 hover:fill-icon-100 focus-visible:fill-icon-100',
    socialIcon: 'h-5 w-5',
};

export const Navigation: FC = () => {
    const { changeTab, tabs, isActive, tabProps } = useContext<TabContext<AppSettingsModalTabs>>(TabContext);
    const tabsRef = useRef(objectKeysToIdArray(tabs));
    const {
        getIsFocused,
        getTabIndex,
        withFocusSet,
        setRoot,
    } = useKeyboardNavigation(tabsRef);

    return (
        <div>
            <TabList
                label='Настройки приложения'
                orientation='vertical'
                tabIndex={0}
                innerRef={setRoot}
            >
                <NavigationHeading>
                    <>Настройки пользователя</>
                </NavigationHeading>

                <MoveFocusInside enabled={getIsFocused(tabs.profileTab.identifier)}>
                    <Button
                        className={styles.button}
                        isActive={isActive.profileTab}
                        label='Моя учётная запись'
                        tabIndex={getTabIndex(tabs.profileTab.identifier)}
                        {...tabProps.profileTab}
                        onLeftClick={withFocusSet(tabs.profileTab.identifier, changeTab.profileTab)}
                    >
                        <NavigationItem isActive={isActive.profileTab}>
                            <>Моя учётная запись</>
                        </NavigationItem>
                    </Button>
                </MoveFocusInside>

                <Separator spacing={16}/>

                <NavigationHeading>
                    <>Настройки приложения</>
                </NavigationHeading>

                <MoveFocusInside enabled={getIsFocused(tabs.appearanceTab.identifier)}>
                    <Button
                        className={styles.button}
                        isActive={isActive.appearanceTab}
                        label='Внешний вид'
                        tabIndex={getTabIndex(tabs.appearanceTab.identifier)}
                        {...tabProps.appearanceTab}
                        onLeftClick={withFocusSet(tabs.appearanceTab.identifier, changeTab.appearanceTab)}
                    >
                        <NavigationItem isActive={isActive.appearanceTab}>
                            <>Внешний вид</>
                        </NavigationItem>
                    </Button>
                </MoveFocusInside>
            </TabList>

            <Separator spacing={16}/>

            <Button
                className={styles.button}
                label='Выйти за аккаунта'
                onLeftClick={() => console.log('click on logout button')}
            >
                <NavigationItem className={styles.logoutButton}>
                    <span>Выйти</span>

                    <SpriteImage
                        className={styles.logoutIcon}
                        name='DOORWAY_ICON'
                    />
                </NavigationItem>
            </Button>

            <Separator spacing={16}/>

            <div className={styles.socialWrapper}>
                <Link
                    className={styles.socialIconWrapper}
                    href='https://twitter.com/discord'
                    label='Мы в twitter'
                >
                    <SpriteImage
                        className={styles.socialIcon}
                        name='TWITTER_ICON'
                    />
                </Link>

                <Link
                    className={styles.socialIconWrapper}
                    href='https://www.facebook.com/discord'
                    label='Мы в facebook'
                >
                    <SpriteImage
                        className={styles.socialIcon}
                        name='FACEBOOK_ICON'
                    />
                </Link>

                <Link
                    className={styles.socialIconWrapper}
                    href='https://www.instagram.com/discord/'
                    label='Мы в instagram'
                >
                    <SpriteImage
                        className={styles.socialIcon}
                        name='INSTAGRAM_ICON'
                    />
                </Link>
            </div>
        </div>
    );
};