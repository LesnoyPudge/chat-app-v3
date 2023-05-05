import { AppSettingsModalTabs, Button, Icon, Link, Separator, TabContext, TabList } from '@components';
import { useKeyboardNavigation } from '@hooks';
import { objectKeysToIdArray } from '@utils';
import { FC, useContext, useRef } from 'react';
import { MoveFocusInside } from 'react-focus-lock';
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
    const { changeTab, tabs, isActive, tabProps } = useContext(TabContext) as TabContext<AppSettingsModalTabs>;
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

                <MoveFocusInside disabled={!getIsFocused(tabs.profileTab.identifier)}>
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
                    label='Мы в twitter'
                >
                    <Icon 
                        className={styles.socialIcon}
                        iconId='twitter-icon'
                    />
                </Link>

                <Link
                    className={styles.socialIconWrapper}
                    href='https://www.facebook.com/discord'
                    label='Мы в facebook'
                >
                    <Icon
                        className={styles.socialIcon}
                        iconId='facebook-icon'
                    />
                </Link>

                <Link
                    className={styles.socialIconWrapper}
                    href='https://www.instagram.com/discord/'
                    label='Мы в instagram'
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